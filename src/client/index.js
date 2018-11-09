const body = document.getElementById('app');

fetch('/api/getUsername')
  .then(r => r.json())
  .then(r => body.innerHTML = r.username)