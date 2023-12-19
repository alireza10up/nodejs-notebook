
const fs = require('fs');
const http = require('http');
const axios = require('axios');
const insertToFile = require('./inserttofile');
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
        return (matchedRoute) ? matchedRoute["callback"] : "route not found";
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

Route.get("file", insertToFile.showFile);
Route.post("file", insertToFile.fileAppend);

Route.get("route", function (req, res) { return 'i run in get' });
Route.post("route", (req, res) => 'i run in post');

Route.post("call", call);

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

    let data = '';
    req.on('data', chunk => {
        data += chunk ?? '';
    }).on('end', () => {
        try {
            result = Route.execute(fp, method);
            if (result instanceof Function) {
                res.writeHead(200, headers.text);


                result(req, data,res)
                .then((res) => {
                    console.log('vasati res.data', res.data);
                     

                    console.log("vasati call res")
                    res.write("ahmad - " + Math.floor(Math.random() * 100));
                    res.end();
                })
                .catch((err) => {
                    console.log(err);
                });

                
                
            } else {
                res.write(result);
            }
        } catch (err) {
            console.log('Err : ', err);
        }
        res.end();
    });
}

function call(req, data , res) {
    let result = axios.post('http://localhost:8586/call', data)
        

    return result;
}