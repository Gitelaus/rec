var express = require('express');
var router = express.Router();
var path = require('path');
var waveform = require('waveform-node');
var fileModel = new require('./files.model.ts');
fileModel.getFile('test.txt').then(function (e) {
    console.log(e);
});
router.export = {
    baseRoute: '/files',
};
/* GET home page. */
router.get('/', function (req, res, next) {
    fileModel.getFiles().then((files) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify({
            data: files
        }));
    });
});
router.get('/file/:fileId', function (req, res, next) {
    fileModel.getFileData(req.params.fileId).then(function (file_data) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            data: file_data
        }));
    });
});
router.get('/file/:fileId/wave', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    fileModel.getFileData(req.params.fileId).then(function (file_data) {
        res.setHeader('Content-Type', 'application/json');
        waveform.getWaveForm('./public/clips/' + req.params.fileId, {}, function (error, peaks) {
            if (error) {
                return;
            }
            // Get peaks
            res.send(peaks);
        });
    });
});
router.get('/file/:fileId/raw', function (req, res, next) {
    res.download(path.resolve(fileModel.getFullFileName(req.params.fileId)), req.params.fileId);
});
module.exports = router;
