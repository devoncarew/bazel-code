'use strict';

import * as vscode from 'vscode';
import cp = require('child_process');
import which = require('which');

const MISSING_BUILDIFIER_MESSAGE = 'Bazel buildifier was not found; install it or set the "bazel.buildifierPath" setting to use the formatter.';

export function activate(context: vscode.ExtensionContext) {
    vscode.languages.registerDocumentFormattingEditProvider('bazel', {
        provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
            return new Promise((resolve, reject) => {
                document.save().then(() => {
                    let buildifierPath = vscode.workspace.getConfiguration('bazel')['buildifierPath'];
                    if (!buildifierPath) {
                        try {
                            buildifierPath = which.sync('buildifier');
                        } catch (err) { }
                    }
                    if (!buildifierPath) {
                        vscode.window.showInformationMessage(MISSING_BUILDIFIER_MESSAGE);
                        return reject(MISSING_BUILDIFIER_MESSAGE);
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
