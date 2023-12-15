
const fs = require('fs');
const http = require('http');
const port = 8585;
const server = http.createServer(rh);
server.listen(port);

/* routing */

class Route {
    static routes = [];

    static execute(route, method) {
        const matchedRoute = this.routes.find((recordedRoute) => {
            return (
                recordedRoute["route"] == route
                &&
                recordedRoute["method"].toLowerCase() == method.toLowerCase()
            );
        });
        return (matchedRoute) ? matchedRoute["callback"]() : "route not found";
    }

    static get(route, callback) {
        this.routes.push({
            "route": route,
            "method": "GET",
            "callback": callback
        });
    }

    static post(route, callback) {
        this.routes.push({
            "route": route,
            "method": "POST",
            "callback": callback
        });
    }
}

Route.get("route", () => 'i.run.in.get');
Route.post("route", () => 'i.run.in.post');

console.log(Route.routes);

const headers = {
    text: { 'Content-Type': 'text/plain' },
    html: { "Content-Type": "text/html" },
};

function rh(req, res) {
    const url = req.url;
    const fp = url.split('/')[1];
    const method = req.method;
    let result;

    result = Route.execute(fp, method);
    console.log(result);
    res.write(result);

    // let data = '';
    // req.on('data', chunk => {
    //     data += chunk ?? '';
    // }).on('end', () => {
    //     try {
    //         result = Route.execute(fp, method);
    //         res.write(result);
    //         // result = routes[fp](req, data);
    //     } catch (err) {
    //         console.log('Err : ', err);
    //     }
    // });

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
        if (err) console.log('file not found');
        else {
            let writeData = JSON.parse(dataFile);
            writeData.data.push(JSON.parse(data));
            return insertToFile(req, JSON.stringify(writeData));
        }
    });
}

function showFile(req, data) {
    return fs.readFile('file.txt', function (err, dataFile) {
        if (err) return 'file not found !';
        let writeData = JSON.parse(dataFile);
        writeData.data.push(JSON.parse(data));
        insertToFile(req, JSON.stringify(writeData));
    });
}