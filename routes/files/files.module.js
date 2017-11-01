var express = require('express');
var router = express.Router();
var path = require('path');
var fileModel = new require('./files.model.ts');
fileModel.getFile('test.txt').then(function (e) {
    console.log(e);
});
router.export = {
    baseRoute: '/files',
};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('files', { title: 'Express' });
});
router.get('/file/:fileId', function (req, res, next) {
    var collectiveVars;
    fileModel.getFile(req.params.fileId).then(function (file_content) {
        collectiveVars = {};
        fileModel.getFileData(req.params.fileId).then(function (file_data) {
            fileModel.getFiles().then(function (files) {
                file_data[0].time_diff = (file_data[0].end_time.getTime() - file_data[0].start_time.getTime()) / 1000;
                res.render('files', {
                    title: 'File',
                    file: file_data[0],
                    out: files
                });
            });
        });
    });
});
router.get('/file/:fileId/raw', function (req, res, next) {
    res.download(path.resolve(fileModel.getFullFileName(req.params.fileId)), req.params.fileId);
});
module.exports = router;
