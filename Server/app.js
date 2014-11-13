var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var busboy = require('connect-busboy');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var app = express();

var routes = require('./routes/index');
var budiRouter = require('./routes/budi-router');
var meetRouter = require('./routes/meet-router');

mongoose.connect('mongodb://localhost/budi');
//mongoose.connect('mongodb://192.168.1.83:27017/budi');
//mongoose.connect('mongodb://sdis:sdis@ds033469.mongolab.com:33469/heroku_app25755838');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser({ keepExtensions: true, uploadDir: '/my/files' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(busboy());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/budies', budiRouter);
app.use('/api/meets', meetRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

//module.exports = app;
