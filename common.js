function addInputListener(callback) {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('input').addEventListener('input', (event) => {
      document.getElementById('output').innerHTML = callback(event.target.value);
    });
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
