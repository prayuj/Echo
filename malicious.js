const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
    // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        // Handle preflight requests
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const headers = req.headers;

            // Construct JSON response
            const responseData = {
                message: 'done'
            };

            res.writeHead(200, {
                'Content-Type': 'application/json',
                ...headers,
            });
            console.log(body);
            // Send JSON response
            res.end(JSON.stringify(responseData));
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
