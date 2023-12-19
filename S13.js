/* packages */

const http = require('http');
const jwt = require('jsonwebtoken');
const Route = require('./router');
const database = require('./database');

/* Run Server */

const port = 8585;
const server = http.createServer(rh);
server.listen(port);

console.log('server run on :', `http://localhost:${port}`);

/* variables */

const saltSecurity = "=//Abs:sldfjnavioierrfeawrj:256";

const headers = {
    text: { 'Content-Type': 'text/plain' }, html: { "Content-Type": "text/html" },
};

const types = {
    text: 'text/plain', html: 'text/html'
}

/* register routes */

Route.post('sign_up', async (req, res, data) => {
    // Validate JSON data
    data = data ? data : '{}';
    const dataJson = await Promise.resolve(JSON.parse(data));
    const { name, email, pass } = dataJson;
    if (name === undefined || email === undefined || pass === undefined) {
        console.log('Data Not Valid');
        return 'Data Not Valid';
    }

    // check exist
    try {
        const users = await database.showFile();
        let found = false;

        for (let user of users) {
            if (name === user.name && email === user.email && pass === user.pass) {
                found = user;
            }
        }

        if (found) {
            return 'User Exists !';
        } else {
            // Append data to file
            const result = await database.fileAppend(data);

            // check result
            if (result) {
                return 'User registered successfully';
            } else {
                return 'Error registering user';
            }
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return 'Error processing request';
    }
});

Route.get('sign_up', async (req, res, data) => {
    const loginForm = database.loadFile('pages/register.html');
    res.setHeader('Content-Type', types.html);
    return loginForm;
});

Route.post('sign_in', async (req, res, data) => {
    // Validate JSON data
    data = data ? data : '{}';
    const dataJson = await Promise.resolve(JSON.parse(data));
    const { name, email, pass } = dataJson;
    if (name === undefined || email === undefined || pass === undefined) {
        console.log('Data Not Valid');
        return 'Data Not Valid';
    }

    try {
        const users = await database.showFile();
        let found = false;

        for (let user of users) {
            if (name === user.name && email === user.email && pass === user.pass) {
                found = user;
            }
        }

        if (found) {
            const token = await jwt.sign(found, saltSecurity);
            res.setHeader('Content-Type', types.text);
            res.setHeader('Set-Cookie', token);
            return 'user found !';
        } else {
            return 'user not found !';
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return 'Error processing request';
    }
});

Route.get('sign_in', async (req, res, data) => {
    const loginForm = database.loadFile('pages/login.html');
    res.setHeader('Content-Type', types.html);
    return loginForm;
});

Route.get('user_info', async (req, res) => {
    const token = req.headers.cookie ?? "empty";

    try {
        const userData = await jwt.verify(token, saltSecurity);

        if (userData) {
            return `User is logged in :
			 name : ${userData.name}
			 email : ${userData.email}
			 pass : ${userData.pass}`;
        } else {
            return 'User is not logged in';
        }
    } catch (error) {
        console.error('Error validating token:', error);
        res.write('Invalid token');
    }
});

console.log('route available : ', Route.routes);

function rh(req, res) {
    const url = req.url;
    const fp = url.split('/')[1];
    const method = req.method;
    let result;

    let data = '';
    req.on('data', chunk => {
        data += chunk ?? '';
    });
    req.on('end', () => {
        try {
            result = Route.execute(fp, method);
            if (result instanceof Function) {
                // call controller func
                result = result(req, res, data);
                // handle request
                result.then((data) => {
                    // set header default
                    if (!res.hasHeader('Content-Type')) {
                        res.writeHead(200, { 'Content-Type': types.text });
                    }
                    res.write(data.data !== undefined ? data.data : data);
                    res.end();
                }).catch((e) => {
                    console.log(e);
                    res.end();
                });
            } else {
                res.write(result);
                res.end();
            }
        } catch (err) {
            console.log('Err : ', err);
            res.end();
        }
    });
}

function write(res, data, status) {
    res.writeHead(200, headers.text);
    res.write(data);
    res.end();
}