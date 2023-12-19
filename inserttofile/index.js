const fs = require('fs');

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
    let fileRead = fs.readFile('file.txt', 'utf-8', function (err, dataFile) {
        if (err) return 'file not found !';
        return dataFile;
    });
    return fileRead;
}

exports.fileAppend = fileAppend;
exports.showFile = showFile;