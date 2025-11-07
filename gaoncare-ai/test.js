// Simple test script for GaonCare.AI API
const http = require('http');

const testQuestions = [
  'What are good foods during pregnancy?',
  'How to manage diabetes?',
  'What are COVID-19 symptoms?',
  'How to treat a cold?'
];

function makeRequest(question) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ question: question });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/ai/health-advice',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(data)
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting GaonCare.AI API Tests\n');
  console.log('================================\n');

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`Test ${i + 1}: "${question}"`);

    try {
      const result = await makeRequest(question);
      console.log(`✅ Status: ${result.statusCode}`);
      console.log(`✅ Success: ${result.body.success}`);
      console.log(`✅ Answer: ${result.body.answer.substring(0, 100)}...`);
      console.log('');
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log('');
    }
  }

  console.log('================================');
  console.log('🧪 Tests completed!\n');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
