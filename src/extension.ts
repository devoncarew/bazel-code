'use strict';

import * as vscode from 'vscode';
import cp = require('child_process');

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerDocumentFormattingEditProvider('bazel', {
        provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
            return new Promise((resolve, reject) => {
                document.save().then(() => {
                    let buildifierPath = vscode.workspace.getConfiguration('bazel')['buildifierPath'];
                    if (!buildifierPath) {
                        vscode.window.showInformationMessage("Set the 'bazel.buildiferPath' setting to use the formatter.");
                        return reject('You must set bazel.buildiferPath to use the formatting.');
                    }

                    cp.execFile(buildifierPath, ["-mode=fix", document.fileName], {},
                        (err, stdout, stderr) => {
                            if (err && (<any>err).code == 'ENOENT') {
                                vscode.window.showInformationMessage(`buildifier path is incorrect: '${buildifierPath}'`);
                                return reject('buildifier path is incorrect.');
                            }

                            if (err) {
                                return reject("Can not format due to syntax errors.")
                            }

                            return resolve(null);
                        });
                });
            });
        }
    });
}

export function deactivate() {

}
