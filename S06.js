const http = require('http');

http.createServer(serverHandler).listen(8585);

function serverHandler(req, res) {

    const headers = { "Content-Type": "text/plain" };
    const url = req.url;

    res.writeHead(200, headers);

    if(url) {
        res.write("Your Url : " + url);
    }

    res.end();

};