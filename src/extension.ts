'use strict';
import { Block } from './block';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let lastInput: string;

    let alignByRegex = vscode.commands.registerTextEditorCommand('align.by.regex', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
        let templates = vscode.workspace.getConfiguration().get('align.by.regex.templates') as { [key: string]: string[] };
        if (templates !== undefined) {

            let selection: vscode.Selection = textEditor.selection;
            if (!selection.isEmpty) {
                let textDocument = textEditor.document;
                let range = new vscode.Range(new vscode.Position(selection.start.line, 0), new vscode.Position(selection.end.line, textDocument.lineAt(selection.end.line).range.end.character));
                let text = textDocument.getText(range);
                let block: Block = new Block(text, templates, selection.start.line, textDocument.eol);
                await textEditor.edit(e => {
                    let idx = selection.start.line;
                    for (let line of block.target) {
                        let deleteRange = new vscode.Range(new vscode.Position(idx, 0), new vscode.Position(idx, textDocument.lineAt(idx).range.end.character));
                        let replacement: string = line;
                        idx++;
                        e.replace(deleteRange, replacement);
                    }
                });
            }
        }
    });
    context.subscriptions.push(alignByRegex);
}

// this method is called when your extension is deactivated
export function deactivate() {
}