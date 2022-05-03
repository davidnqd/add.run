function generate(callback) {
  document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    output.innerHTML = callback(event.target.value)
  });
}

function addInputListener(callback) {
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    input.addEventListener('input', (event) => output.innerHTML = callback(event.target.value));

    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop) });

    if (params.q) {
      input.value = params.q;
      output.innerHTML = callback(input.value);
    }
  });
}

async function copy() {
  await navigator.clipboard.writeText(document.getElementById('output').innerHTML);
  // Get the snackbar DIV
  const snackbar = document.getElementById("snackbar");

  // Add the "show" class to DIV
  snackbar.innerHTML = "Output copied to clipboard!";
  snackbar.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(() => snackbar.className = snackbar.className.replace("show", ""), 3000);
}
