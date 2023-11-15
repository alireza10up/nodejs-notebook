let http = require('http');
let port = 8080;
let server = http.createServer(requestHandler);
server.listen(port);

const routes = {
    sum: sum,
    minus: minus
}

let header = { 'Content-Type': 'text/plain' };

function requestHandler(request, response) {
    const url = request.url;
    const fp = url.spit('/')[1];

    if (fp !== 'favicon.ico' && routes[fp] instanceof Function) {
        routes[fp](response);
    } else {
        response.writeHead(404, header);
        response.write('minus');
    }

    response.end();
}

function sum(response) {
    response.writeHead(header);
    response.write('sum');
}

function minus(response) {
    response.writeHead(200, header);
    response.write('minus');
}