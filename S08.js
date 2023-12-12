const fs = require('fs');
const http = require('http');
const port = 8585;
const server = http.createServer(rh);
server.listen(port);

const routes = {
    fileUpload: fileUpload
}

const headers = {
    text: { 'Content-Type': 'text/plain' },
    html: { "Content-Type": "text/html" },
};

function rh(req, res) {
    const url = req.url;
    const fp = url.split('/')[1];
    let result;

    if (fp !== 'favicon.ico' && routes[fp] instanceof Function) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        }).on('end', () => {
            result = routes[fp](req, data);
        });
    }

    res.end();
}

function fileUpload(req, data) {
    try {
        console.log(data);
    } catch (error) {
        console.log('Err : ', error);
    }
}