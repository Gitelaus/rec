var fs = require('fs');
var _ = require('lodash');

class FileModel {

    constructor(){
        this.FILE_PATH = `./public/clips/`;
    }

    getFile(filename){
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.FILE_PATH}${filename}`, function(err, file){
                if(err)reject('NO FILE FOUND FUCKER');
                resolve(file);
            });
        });
    }

    getFullFileName(filename){
        return `${this.FILE_PATH}${filename}`;
    }

    getFileData(filename){
        return new Promise((resolve, reject) => {
            global.connection.query(`SELECT * FROM files WHERE filename=?`, [filename], function(error, results, fields){
                if(error)reject(error);
                resolve(results);
            });
        });
    }

    getFiles(options){
        options = options || {};
        return new Promise((resolve, reject) => {
            var base_query = 'SELECT * FROM files';
            var query_conditions = '';
            var query_parameters = [];

            if(options['params']) {
                for (const param in options.params) {
                    query_conditions = (query_conditions == '' ? ' WHERE' : ' AND') + ` ${param} = ?`;
                    query_parameters.push(options.params[param]);
                }
            }

            var construct_query = `${base_query}${query_conditions}`;

            global.connection.query(construct_query, query_parameters, function(error, results, fields){
                if(error)reject(error);
                resolve(results);
            });
        });
    }


    transformArray(data, fields){
        var objectArr = [];
        for(const d in data){
            var obj = {};
            for(const f in fields){
                console.log(d);
            }
            objectArr.push(obj);
        }
    }
}

module.exports = new FileModel();