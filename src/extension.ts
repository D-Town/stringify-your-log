import * as vscode from "vscode";

type OutputMode = "stringify" | "dir";

function getConfig() {
  const cfg = vscode.workspace.getConfiguration("stringifyYourLog");
  const outputMode = (cfg.get<string>("outputMode") ?? "stringify") as OutputMode;
  const dirDepth = cfg.get<number | null>("dirDepth", null);
  const dirColors = cfg.get<boolean>("dirColors", true);
  return { outputMode, dirDepth, dirColors };
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

function buildLogText(
  variable: string,
  full: boolean,
  mode: OutputMode,
  dirDepth: number | null,
  dirColors: boolean,
  sourceLine: number,
  sourceFile: string
): string {
  const header = `console.log("Log from line ${sourceLine} in file ${sourceFile}");`;

  if (mode === "dir") {
    const dirOptions = `{ depth: ${dirDepth === null ? "null" : dirDepth}, colors: ${dirColors ? "true" : "false"} }`;

    if (full) {
      return [
        `console.log("🚀 Log from line ${sourceLine} in file ${sourceFile}");`,
        `console.dir(${variable}, ${dirOptions});`,
        "console.log('🔚');"
      ].join("\n");
    }

    return [
      header,
      `console.dir(${variable}, ${dirOptions});`
    ].join("\n");
  }

  if (full) {
    return [
      `console.log("🚀 Log from line ${sourceLine} in file ${sourceFile}");`,
      `console.log(JSON.stringify(${variable}, null, 2));`,
      "console.log('🔚');"
    ].join("\n");
  }

  return [
    header,
    `console.log(JSON.stringify(${variable}, null, 2));`
  ].join("\n");
}

function getSourceFileLabel(doc: vscode.TextDocument): string {
  const rawPath = vscode.workspace.asRelativePath(doc.uri, false);
  const normalizedPath = rawPath.replace(/\\/g, "/");
  const parts = normalizedPath.split("/").filter(Boolean);
  if (parts.length === 0) { return normalizedPath || "unknown-file"; }
  return parts.slice(-3).join("/");
}

function getInsertionPlan(doc: vscode.TextDocument, cursorPos: vscode.Position, logText: string) {
  const targetLine = cursorPos.line + 1;

  if (targetLine >= doc.lineCount) {
    const lastLineEnd = doc.lineAt(doc.lineCount - 1).range.end;
    return { position: lastLineEnd, text: `\n${logText}` };
  }

  const targetLineText = doc.lineAt(targetLine).text;
  const shouldPushDown = targetLineText.trim().length > 0;

  return {
    position: new vscode.Position(targetLine, 0),
    text: shouldPushDown ? `${logText}\n` : logText
  };
}

async function insertPrettyLog(editor: vscode.TextEditor, full: boolean) {
  const { outputMode, dirDepth, dirColors } = getConfig();

  const variable =
    getSelectedOrWord(editor) ??
    (await vscode.window.showInputBox({
      prompt: "Variable or expression to log",
      placeHolder: "e.g. user, payload.items, response.data"
    }))?.trim();

  if (!variable) { return; }

  const doc = editor.document;
  const cursorPos = editor.selection.active;
  const sourceLine = cursorPos.line + 1;
  const sourceFile = getSourceFileLabel(doc);

  const logText = buildLogText(variable, full, outputMode, dirDepth, dirColors, sourceLine, sourceFile);
  const { position, text } = getInsertionPlan(doc, cursorPos, logText);

  await editor.edit((editBuilder) => {
    editBuilder.insert(position, text);
  });
}

function createStringifyCompletionItem(
  label: string,
  commandId: "stringify-your-log.logJson" | "stringify-your-log.logJsonFull",
  range: vscode.Range
) {
  const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
  item.insertText = "";
  item.range = range;
  item.filterText = "stringify";
  item.sortText = label.includes("short") ? "0001" : "0002";
  item.detail = "Stringify Your Log";
  item.command = { command: commandId, title: label };
  return item;
}

export function activate(context: vscode.ExtensionContext) {
  const logJsonCommand = vscode.commands.registerCommand("stringify-your-log.logJson", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    await insertPrettyLog(editor, false);
  });

  const logJsonFullCommand = vscode.commands.registerCommand("stringify-your-log.logJsonFull", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    await insertPrettyLog(editor, true);
  });

  const completionProvider = vscode.languages.registerCompletionItemProvider(
    [
      { language: "javascript", scheme: "file" },
      { language: "typescript", scheme: "file" },
      { language: "javascriptreact", scheme: "file" },
      { language: "typescriptreact", scheme: "file" }
    ],
    {
      provideCompletionItems(document, position) {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) { return undefined; }

        const typedText = document.getText(wordRange).toLowerCase();
        if (!"stringify".startsWith(typedText) || typedText.length === 0) { return undefined; }

        return [
          createStringifyCompletionItem("Stringify short", "stringify-your-log.logJson", wordRange),
          createStringifyCompletionItem("Stringify full", "stringify-your-log.logJsonFull", wordRange)
        ];
      }
    }
  );

  context.subscriptions.push(logJsonCommand, logJsonFullCommand, completionProvider);
}

export function deactivate() { }
