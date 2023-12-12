
const fs = require('fs');
const http = require('http');
const port = 8585;
const server = http.createServer(rh);
server.listen(port);

const routes = {
    fileUpload: fileUpload,
    fileWrite: insertToFile,
    fileAppend: fileAppend
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
            try {
                result = routes[fp](req, data);
            } catch (err) {
                console.log('Err : ', err);
            }
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

function insertToFile(req, data) {
    fs.writeFile('file.txt', data, 'utf-8', err => {
        if (err) console.log('err : ', err);
        else console.log('file saved !');
    });
}

function fileAppend(req, data) {
    fs.readFile('file.txt', function (err, dataFile) {
        let writeData = JSON.parse(dataFile);
        writeData.data.push(JSON.parse(data));
        insertToFile(req, JSON.stringify(writeData));
    });
}