const http = require('http');

http.createServer(serverHandler).listen(8585);

const funcs = {
    sum: (url) => { return funcs.action("+", url) },
    mines: (url) => { return funcs.action("-", url) },
    "favicon.ico": (url) => { return funcs.action("fav", url) },
    action: (action, url) => {
        return action + " " + " " + url;
    }
}

function serverHandler(req, res) {

    const headers = { "Content-Type": "text/plain" };
    const url = req.url;

    res.writeHead(200, headers);

    route = url.split('/');

    console.log(route);

    (typeof funcs[route[1]] === "function") ?
        res.write(funcs[route[1]](url))
        :
        res.write('Function Not Exits : ' + route[1])
        ;

    res.end();

};