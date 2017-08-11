## Releasing

Make sure the CHANGELOG.md entries are up-to-date.

Rev the CHANGELOG.md version for the release to the anticipated version number.

Install the `vsce` tool (see https://code.visualstudio.com/docs/extensions/publish-extension).

Run `vsce publish patch` (or `minor` for minor releases). As part of this, the
plugin version in package.json will be autimatically updated.
