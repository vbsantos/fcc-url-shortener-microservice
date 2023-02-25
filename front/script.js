const form = document.querySelector('form');
const resultContainer = document.querySelector('#result');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const urlInput = document.querySelector('#url');
  const url = urlInput.value.trim();

  // Make API request
  fetch('/api/shorturl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.short_url) {
        const shortUrl = `${window.location.href}api/shorturl/${data.short_url}`;
        // Update result container
        resultContainer.innerHTML = `<code>${JSON.stringify(data)}</code>
        <br/>
        <a href="${shortUrl}">${shortUrl}</a>`;
      } else {
        resultContainer.innerHTML = `<code>${JSON.stringify(data)}</code>`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultContainer.innerHTML = `<code>There was an error with your request. Please try again.</code>`;
    });
});
