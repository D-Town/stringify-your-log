import * as vscode from "vscode";

type OutputMode = "stringify" | "dir";

function getConfig() {
  const cfg = vscode.workspace.getConfiguration("stringifyYourLog");
  const outputMode = (cfg.get<string>("outputMode") ?? "stringify") as OutputMode;
  const dirDepth = cfg.get<number | null>("dirDepth", null);
  const dirColors = cfg.get<boolean>("dirColors", true);
  const smartPlacement = cfg.get<boolean>("smartPlacement", true);
  return { outputMode, dirDepth, dirColors, smartPlacement };
}

function getSelectedOrWord(editor: vscode.TextEditor): string | null {
  const selection = editor.selection;
  const selectedText = editor.document.getText(selection).trim();
  if (selectedText) { return selectedText; }

  const wordRange = editor.document.getWordRangeAtPosition(selection.active);
  if (!wordRange) { return null; }

  const word = editor.document.getText(wordRange).trim();
  return word || null;
}

function getNextLineInsertPosition(doc: vscode.TextDocument, pos: vscode.Position) {
  const nextLine = Math.min(pos.line + 1, doc.lineCount - 1);
  return new vscode.Position(nextLine, 0);
}

/**
 * Smart placement:
 * Tries to find the next closing '}' that completes the current block nesting from the cursor forward,
 * ignoring strings and comments. If found, inserts on the next line after that block.
 *
 * This is a pragmatic solution (not a full parser), but works well for typical JS/TS blocks like:
 * map(() => { ... }), if { ... }, try { ... }, etc.
 */
function findInsertPosAfterEnclosingBlock(
  doc: vscode.TextDocument,
  pos: vscode.Position
): vscode.Position | null {
  const text = doc.getText();
  const offset = doc.offsetAt(pos);

  let depth = 0;

  let inS = false; // '
  let inD = false; // "
  let inT = false; // `
  let inLC = false; // //
  let inBC = false; // /* */

  for (let i = offset; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];

    // line comments
    if (inLC) {
      if (c === "\n") { inLC = false; }
      continue;
    }
    // block comments
    if (inBC) {
      if (c === "*" && n === "/") {
        inBC = false;
        i++;
      }
      continue;
    }

    // entering comments (only if not in string)
    if (!inS && !inD && !inT) {
      if (c === "/" && n === "/") {
        inLC = true;
        i++;
        continue;
      }
      if (c === "/" && n === "*") {
        inBC = true;
        i++;
        continue;
      }
    }

    // toggle strings
    const prev = text[i - 1];
    if (!inD && !inT && c === "'" && prev !== "\\") {
      inS = !inS;
      continue;
    }
    if (!inS && !inT && c === `"` && prev !== "\\") {
      inD = !inD;
      continue;
    }
    if (!inS && !inD && c === "`" && prev !== "\\") {
      inT = !inT;
      continue;
    }

    if (inS || inD || inT) { continue; }

    if (c === "{") { depth++; }

    if (c === "}") {
      if (depth > 0) { depth--; }

      // when we return to 0 from a nested block, we insert after that closing brace
      if (depth === 0) {
        const closePos = doc.positionAt(i);
        const nextLine = Math.min(closePos.line + 1, doc.lineCount - 1);
        return new vscode.Position(nextLine, 0);
      }
    }
  }

  return null;
}

function buildSnippet(variable: string, full: boolean, mode: OutputMode, dirDepth: number | null, dirColors: boolean) {
  if (mode === "dir") {
    const dirOptions = `{ depth: ${dirDepth === null ? "null" : dirDepth}, colors: ${dirColors ? "true" : "false"} }`;

    if (full) {
      return new vscode.SnippetString(
        [
          `console.log(\`🚀 Log for: \${${variable}}\`);`,
          `console.dir(${variable}, ${dirOptions});`,
          `console.log('🔚');`
        ].join("\n")
      );
    }

    return new vscode.SnippetString(`console.dir(${variable}, ${dirOptions});`);
  }

  // stringify mode
  if (full) {
    return new vscode.SnippetString(
      [
        `console.log(\`🚀 Log for: \${${variable}}\`);`,
        `console.log(JSON.stringify(${variable}, null, 2));`,
        `console.log('🔚');`
      ].join("\n")
    );
  }

  return new vscode.SnippetString(`console.log(JSON.stringify(${variable}, null, 2));`);
}

async function insertPrettyLog(editor: vscode.TextEditor, full: boolean) {
  const { outputMode, dirDepth, dirColors, smartPlacement } = getConfig();

  const variable =
    getSelectedOrWord(editor) ??
    (await vscode.window.showInputBox({
      prompt: "Variable or expression to log",
      placeHolder: "e.g. user, payload.items, response.data"
    }))?.trim();

  if (!variable) { return; }

  const doc = editor.document;
  const cursorPos = editor.selection.active;

  const fallbackPos = getNextLineInsertPosition(doc, cursorPos);
  const smartPos = smartPlacement ? findInsertPosAfterEnclosingBlock(doc, cursorPos) : null;
  const insertPos = smartPos ?? fallbackPos;

  const snippet = buildSnippet(variable, full, outputMode, dirDepth, dirColors);
  await editor.insertSnippet(snippet, insertPos);
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("stringify-your-log.logJson", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { return; }
      await insertPrettyLog(editor, false);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("stringify-your-log.logJsonFull", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { return; }
      await insertPrettyLog(editor, true);
    })
  );
}

export function deactivate() { }
