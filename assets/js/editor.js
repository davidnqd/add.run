'use strict';

function toCodeMirror (element) {
  let codeMirror = CodeMirror.fromTextArea(element, {
    mode: {name: "javascript", json: true},
    lineNumbers: true,
    theme: "lesser-dark",
    spellcheck: true,
    foldGutter: true,
    extraKeys: {
        "Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); },
        "Tab": "indentMore"
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    foldOptions: {
      widget: (from, to) => {
        var count = undefined;

        // Get open / close token
        var startToken = '{', endToken = '}';
        var prevLine = window.editor.getLine(from.line);
        if (prevLine.lastIndexOf('[') > prevLine.lastIndexOf('{')) {
          startToken = '[', endToken = ']';
        }

        // Get json content
        var internal = window.editor.getRange(from, to);
        var toParse = startToken + internal + endToken;

        // Get key count
        try {
          var parsed = JSON.parse(toParse);
          count = Object.keys(parsed).length;
        } catch(e) { }

        return count ? `\u21A4${count}\u21A6` : '\u2194';
      }
    }
  });
  Object.defineProperty(codeMirror, 'value', {
    get: codeMirror.getValue,
    set: (value) => codeMirror.setValue(String(value))
  });
  Object.defineProperty(codeMirror, 'json', {
    get: () => jsyaml.load(codeMirror.getValue()),
    set: (value) => codeMirror.setValue(JSON.stringify(value, null, ' '))
  });
  return codeMirror;
}

function include(source) {
  let element = document.head.appendChild(document.createElement('script'));
  element.setAttribute('type', 'text/javascript');
  element.setAttribute('src', source);
  return element;
}

function motd() {
  console.log(`Welcome to lucidED ( Documentation: https://add.run/javascript-devtools-help )

This page includes an editor and a bunch of helper functions for use when Chrome's DevTools is opened here.

For example, make an API call and store the results in the editor:
  editor.json = await fetch( 'https://www.boredapi.com/api/activity' ).then( response => response.json() )

Then use js-yaml to convert the JSON to YAML
  console.log( jsyaml.dump( editor.json ) );

Then store and retrieve the last activity in localStorage which will save data across browser sessions
  localStorage.last = editor.value;
  location.reload();
  editor.value = localStorage.last;
`);
}

document.addEventListener("DOMContentLoaded", (event) => {
  window.editor = toCodeMirror(document.getElementById('editor'));

  motd();

  if (localStorage['.profile']) {
    let element = document.head.appendChild(document.createElement('script'));
    element.setAttribute('type', 'text/javascript');
    element.innerHTML = localStorage['.profile'];
  }
});
