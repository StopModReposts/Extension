# Development

Requirements:

- Node.js and NPM
- A decently up to date Chrome and Firefox
- Git

### Install dev environment

```bash
git clone https://github.com/StopModReposts/Extension SMR-Extension
cd SMR-Extension
npm install
```

### Building

We use webpack to build the extension. To build it, run `npm run build`.  
To automatically watch files for changes and rebuilt them, run `npm run dev`

### Installing browser extension for development

#### Chrome

Go to [chrome://extensions](chrome://extensions) and click "Load Unpacked". Then navigate to your project dir. The extension should load.

#### Firefox

IMPORTANT: firefox cant load plain code, so you need to run `npm run build` every time you change something, watch mode doesnt work with firefox.  
Go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) and click Load temporary addon, navigate to project folder and pick the zip file from the `out/` directory
