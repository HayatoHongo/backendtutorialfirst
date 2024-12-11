document.getElementById('api-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = document.getElementById('input').value;
    const resultElement = document.getElementById('result');
  
    if (!input.trim()) {
      resultElement.textContent = 'Input cannot be empty.';
      return;
    }
  
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      resultElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      resultElement.textContent = `Request failed: ${error.message}`;
    }
  });
  