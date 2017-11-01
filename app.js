var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var exphbs  = require('express-handlebars');

// Database
var mysql      = require('mysql');
global.connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'recordtime'
});

connection.connect();


// Custom Imports
var _ = require('lodash');


// Custom Variables
var MODULES = ['files'];


//

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

console.log(_.times(MODULES.length, function (num){
    return path.join(__dirname, 'routes', MODULES[num], 'views');
}));

// view engine setup
app.set('views', _.times(MODULES.length, function (num){
    return path.join(__dirname, 'routes', MODULES[num], 'views');
}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

_.forEach(MODULES, function(module){
    var module_instance = require('./routes/' + module + '/' + module + '.module.js');
    app.use(module_instance.export.baseRoute, module_instance);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
