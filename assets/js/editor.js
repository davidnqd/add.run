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
    get: () => JSON.parse(codeMirror.getValue()),
    set: (value) => codeMirror.setValue(JSON.stringify(value, null, ' '))
  });
  return codeMirror;
}

function motd() {
  console.log(`Welcome to lucidED ( Documentation: https://add.run/javascript-chop-block-help )

This page includes an editor, an output pane and a bunch of helper functions for use when Chrome's DevTools is opened here.

For example, make an API call and store the results in the editor:
  editor.json = await fetch( 'https://www.boredapi.com/api/activity' ).then( response => response.json() )

Great! Now let's convert it into YAML by first including the js-yaml library:
  document.head.appendChild(document.createElement('script')).src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';

Then use js-yaml to convert the JSON to YAML, then add it to output
  output.append( jsyaml.dump( editor.json ) );

Then store and retrieve the last activity in localStorage which will save data across browser sessions
  localStorage.setItem("last", editor.json.activity);
  console.log(localStorage.getItem("last"))
`);
}

document.addEventListener("DOMContentLoaded", function(event){
  window.editor = toCodeMirror(document.getElementById("editor"));
  motd();
});
