'use strict';

import * as vscode from 'vscode';
import cp = require('child_process');

export function activate(context: vscode.ExtensionContext) {
    // console.log('Hello, bazel!');
    vscode.languages.registerDocumentFormattingEditProvider('bazel', {
        provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
            return new Promise((resolve, reject) => {
                document.save().then(() => {
                    cp.execFile("/usr/local/bin/buildifier", ["-mode=fix", document.fileName], {},
                        (err, stdout, stderr) => {
                            if (err && (<any>err).code == 'ENOENT') {
                                console.log("Couldn't find buildifier.");

                                return resolve(null);
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
