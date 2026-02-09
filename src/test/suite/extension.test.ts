import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('dtown.stringify-your-log'));
  });

  test('Should activate', async () => {
    const extension = vscode.extensions.getExtension('dtown.stringify-your-log');
    await extension?.activate();
    assert.ok(extension?.isActive);
  });

  test('Should register commands', async () => {
    const commands = await vscode.commands.getCommands(true);

    // Deine ECHTEN Commands aus package.json!
    assert.ok(
      commands.includes('stringify-your-log.logJson'),
      'logJson command should be registered'
    );

    assert.ok(
      commands.includes('stringify-your-log.logJsonFull'),
      'logJsonFull command should be registered'
    );
  });
});