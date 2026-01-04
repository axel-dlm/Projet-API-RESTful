const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/games',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.end();