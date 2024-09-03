# rancher-extension-triton
A Rancher extension for Triton.

This project was created by following the instructions outlined in https://extensions.rancher.io/extensions/extensions-getting-started.

## Building the Extension
Install `nvm`:
```bash
brew install nvm
```

Install Node.js version 16:
```bash
nvm install 16
```

Load Node.js version 16:
```bash
nvm use 16
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