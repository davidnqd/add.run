'use strict';

async function generate(callback) {
  //document.addEventListener('DOMContentLoaded', async () => {
    const output = document.getElementById('output');
    output.innerHTML = await callback();
  //});
}

function addInputListener(callback) {
  document.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    input.addEventListener('input', async (event) => output.innerHTML = await callback(event.target.value));

    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop) });

    if (params.q) {
      input.value = params.q;
      output.innerHTML = await callback(input.value);
    }
  });
}

async function copy() {
  await navigator.clipboard.writeText(document.getElementById('output').innerHTML);
  showSnackbar("Output copied to clipboard!");
}

function showSnackbar(message) {
  // Get the snackbar DIV
  const snackbar = document.getElementById('snackbar');

  // Add the "show" class to DIV
  snackbar.innerHTML = message;
  snackbar.className = 'show';

  // After 3 seconds, remove the show class from DIV
  setTimeout(() => snackbar.className = snackbar.className.replace('show', ''), 3000);
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

document.addEventListener('DOMContentLoaded', (event) => {
  motd();

  if (localStorage['.profile']) {
    let element = document.head.appendChild(document.createElement('script'));
    element.setAttribute('type', 'text/javascript');
    element.innerHTML = localStorage['.profile'];
  }
});
