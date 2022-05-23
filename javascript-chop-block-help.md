---
layout: empty
title: DevTool JavaScript Console Helpers Documentation
description: DevTool JavaScript Console Helpers documentation
back: /javascript-chop-block
---

The [DevTool JavaScript Console Helpers](/javascript-chop-block) includes an editor, an output pane and a
bunch of helper functions for use when Chrome's DevTools is opened on that page. It may or may not work for other browsers.

## Usage

Navigate to [DevTool JavaScript Console Helpers](/javascript-chop-block) and press ⌥⌘J (Mac) or Control+Shift+J (Windows, Linux) to open your browser's DevTools Javascript Console.

## Helpers

`editor` can be used to access an instance of <a href="https://codemirror.net/doc/manual.html#api" target="_blank">CodeMirror v5</a>.

`editor.value` can be used to get and set the editor contents as a string. Non-string values are casted to a string (i.e. `String(value)`).

`editor.json` can be used to get and set the editor contents as an object. The getter will take the editor contents and return an object returned by `JSON.parse()`, the setter will take any object and convert it to a string using `JSON.stringify()` first.


## Example

Make an API call and put the results in the editor:

```javascript
editor.json = await fetch( 'https://www.boredapi.com/api/activity' ).then( response => response.json() )
```

Then, include the js-yaml library:

```javascript
document.head.appendChild(document.createElement('script')).src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';
```

Then, use js-yaml to convert the JSON to YAML, then add it to output

```javascript
output.append( jsyaml.dump( editor.json ) );
```

Then, store the activity in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for later

```javascript
localStorage.setItem("last", editor.json.activity);
```

Then, get the last activity from [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

```javascript
console.log(localStorage.getItem("last"))
```
