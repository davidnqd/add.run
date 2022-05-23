---
layout: empty
title: DevTool JavaScript Console Helpers Documentation
description: DevTool JavaScript Console Helpers documentation
back: /javascript-devtools
---

The [DevTool JavaScript Console Helpers](/javascript-devtools) includes an editor, an output pane and a
bunch of helper functions for use when Chrome's DevTools is opened on that page. It may or may not work for other browsers.

## Helpers

<dl>
  <dt id="editor"><code>editor</code></dt>
  <dd>
    <p>Used to access an instance of <a href="https://codemirror.net/doc/manual.html#api" target="_blank">CodeMirror v5</a></p>
  </dd>
  <dt id="editor.value"><code>editor.value</code></dt>
  <dd>
    <p>Used to get and set the editor contents as a string. Non-string values are casted to a string (i.e. <code>String(value)</code>)</p>
  </dd>
  <dt id="editor.json"><code>editor.json</code></dt>
  <dd>
    <p>Used to get and set the editor contents as an object. The getter will take the editor contents and return an object returned by <code>JSON.parse()</code>, the setter will take any object and convert it to a string using <code>JSON.stringify()</code> first.</p>
  </dd>
  <dt id="editor"><code>localStorage['.profile']</code></dt>
  <dd>
    <p>Whatever is stored here is executed on page load</p>
  </dd>
  <dt id="editor"><code>include()</code></dt>
  <dd>
    <p>Include a JavaScript file</p>
  </dd>
</dl>
