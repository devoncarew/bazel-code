'use strict';

import * as vscode from 'vscode';
import cp = require('child_process');

export function activate(context: vscode.ExtensionContext) {
    // console.log('Hello, bazel!');
    vscode.languages.registerDocumentFormattingEditProvider('bazel', {
        provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
            return new Promise((resolve, reject) => {
                document.save().then(() => {
                    let buildifierPath = vscode.workspace.getConfiguration('bazel')['buildifierPath'];
                    if (!buildifierPath) {
                        return reject('You must set bazel.buildiferPath to use the formatting.');
                    }

                    cp.execFile(buildifierPath, ["-mode=fix", document.fileName], {},
                        (err, stdout, stderr) => {
                            if (err && (<any>err).code == 'ENOENT') {
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
