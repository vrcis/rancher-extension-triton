# rancher-extension-triton
A Rancher extension for Triton.

This project was created by following the instructions outlined in https://extensions.rancher.io/extensions/extensions-getting-started.

## Building the Extension
Install `nvm`:
```bash
brew install nvm
```

Install Node.js version 20:
```bash
nvm install 20
```

Load Node.js version 20:
```bash
nvm use 20
```

Install dependencies:
```bash
yarn install
```

[Build the extension](https://extensions.rancher.io/extensions/extensions-getting-started#building-the-extension):
```bash
yarn build-pkg triton
```

Serve the extension so that you can [load it into Rancher](https://extensions.rancher.io/extensions/extensions-getting-started#test-built-extension-by-doing-a-developer-load):
```bash
yarn serve-pkgs
```

## Publishing the Extension
### Automatic GitHub Publishing (preferred)
1. Create a new `triton-{version}` git tag.
   1. Ensure that this matches the version specified in both `package.json` files.
2. Create a new `triton-{version}` release from the new tag.
3. Let the `build-extension-charts` GitHub action run and complete.
   1. Create an empty `gh-pages` branch for the build to be deployed to if it doesn't exist.
   2. If not done already and once the build completes, add the GitHub repository as a Rancher Extension repository while specifying the `gh-pages` branch during configuration.
4. Install/Update the Triton extension from the Extension page.

### Manually Publishing an Extension Catalog Image
```bash
rm -rf assets charts extensions index.yaml dist-pkg 2>/dev/null
yarn publish-pkgs -cf -r harbor.vrcis.com -o rancher -i ''
```
If building on a Mac with an Apple chip (`arm64`) you will need to manually add `--platform linux/amd64` to the `docker build` line to work around https://github.com/rancher/dashboard/issues/9362 in the following file:
```
./node_modules/@rancher/shell/scripts/extension/helm/scripts/package
```
If building on a Mac you will also need to work around https://github.com/rancher/dashboard/pull/12122.

See https://extensions.rancher.io/extensions/publishing#manually-publishing-an-extension-catalog-image for details.

## Rancher Extension Links
- https://extensions.rancher.io/extensions
- https://extensions.rancher.io/extensions/extensions-getting-started#prerequisites
- https://extensions.rancher.io/extensions/changelog
- https://www.npmjs.com/package/@rancher/shell?activeTab=versions
- https://extensions.rancher.io/internal/docs