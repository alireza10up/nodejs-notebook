let fs = require('fs');
let http = require('http');
let port = 8080;
let server = http.createServer(requestHandler);
server.listen(port);

const routes = {
    home: homeController,
    500: throwError500,
    404: throwError404
}

let headers = {
    test: { 'Content-Type': 'text/plain' },
    html: { "Content-Type": "text/html" },
};

function requestHandler(request, response) {
    const url = request.url;
    const fp = url.split('/')[1];
    let result;

    if (fp !== 'favicon.ico' && routes[fp] instanceof Function) {
        response.writeHead(200, headers.html);
        result = routes[fp]();
    } else {
        response.writeHead(404, headers.html);
        result = throwError404();
    }
    response.write(result)
    response.end();
}

function homeController() {
    return fs.readFileSync('pages/home.html', function (error, data) {
        if (error) {
            return throwError500();
        } else {
            return data;
        }
    });
}

function throwError500() {
    return fs.readFileSync('pages/500.html', function (error, data) {
        if (!error) return data;
    });
}

function throwError404() {
    return fs.readFileSync('pages/404.html', function (error, data) {
        if (!error) return data;
    });
}