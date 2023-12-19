const axios = require('axios');

axios.post('http://localhost:8585/call' , {"name" : "ahmad - " + Math.floor(Math.random() * 100)})
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });