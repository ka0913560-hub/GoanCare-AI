// Get DOM elements
const questionInput = document.getElementById('question');
const responseBox = document.getElementById('responseBox');
const responseText = document.getElementById('responseText');
const loadingSpinner = document.getElementById('loading');
const timestampDiv = document.getElementById('timestamp');

// Send question to AI
async function sendQuestion() {
    const question = questionInput.value.trim();

    // Validate input
    if (!question) {
        alert('Please enter a question');
        return;
    }

    // Show loading state
    loadingSpinner.classList.add('show');
    responseBox.classList.remove('show', 'error');

    try {
        // Send request to backend
        const response = await fetch('/ai/health-advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question }),
        });

        // Parse response
        const data = await response.json();

        // Hide loading spinner
        loadingSpinner.classList.remove('show');

        if (response.ok && data.success) {
            // Display success response
            responseText.textContent = data.answer;
            responseBox.classList.add('show');
            responseBox.classList.remove('error');
            timestampDiv.textContent = `Response time: ${new Date(data.timestamp).toLocaleTimeString()}`;
            console.log('✅ AI Response received:', data);
        } else {
            // Display error response
            responseText.textContent = `Error: ${data.error || 'Failed to get response from AI'}`;
            responseBox.classList.add('show', 'error');
            timestampDiv.textContent = `Error time: ${new Date(data.timestamp).toLocaleTimeString()}`;
            console.error('❌ Error from server:', data);
        }

    } catch (error) {
        // Handle network or fetch errors
        loadingSpinner.classList.remove('show');
        responseText.textContent = `Network Error: ${error.message}. Make sure the server is running.`;
        responseBox.classList.add('show', 'error');
        timestampDiv.textContent = `Error time: ${new Date().toLocaleTimeString()}`;
        console.error('❌ Fetch error:', error);
    }
}

// Clear all inputs and responses
function clearAll() {
    questionInput.value = '';
    responseBox.classList.remove('show', 'error');
    loadingSpinner.classList.remove('show');
    responseText.textContent = '';
    timestampDiv.textContent = '';
    questionInput.focus();
}

// Allow Enter key to send (Shift+Enter for new line)
questionInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendQuestion();
    }
});

// Log when page loads
console.log('🚀 GaonCare.AI Frontend loaded successfully');
console.log('📡 API Endpoint: /ai/health-advice');
