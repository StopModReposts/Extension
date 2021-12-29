# Development

Requirements:

- Node.js and NPM
- A decently up to date Chrome and Firefox
- Git

## Install dev environment

```bash
git clone https://github.com/StopModReposts/Extension SMR-Extension
cd SMR-Extension
npm install
```

## Development

Easiest way to get started developing the extension is by using `web-ext`.  
This tool allows you to launch Chromium or Firefox and test the extension.

### Firefox

Run `npm run firefox`

### Chromium

Run `npm run chromium`  
Note that chromium displays a message about icons, its safe to ignore it as it only appears in development

### Passing additional options

Sometimes, you may need to pass additional options to web-ext. Maybe your install is in a different location, maybe you're using Flatpak on Linux. [see docs](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-run)  
To do that, you can use the `CHROMIUM_OPTIONS` and `FIREFOX_OPTIONS` environment variables.  
For example, to run using Chromium Flatpak on Linux:

```bash
CHROMIUM_OPTIONS="--chromium-binary /home/$USER/.local/share/flatpak/exports/bin/org.chromium.Chromium" npm run chromium
```

## Building

To build the extension, run `npm run build`.  
This will produce a zip file containing the output in the directory `web-ext-artifacts`

## Sideloading the build

### Firefox

Mozilla makes it difficult to sideload, you can only install temporarily.  
To do that, go to `about:debugging#/runtime/this-firefox` and click `load temporary addon`, then pick the .zip created

### Chromium

Go to `chrome://extensions/`, enable developer mode, and click `Load unpacked`, then navigate to your build directory and pick it (pick your directory, **NOT** web-ext-artifacts or the .zip)
