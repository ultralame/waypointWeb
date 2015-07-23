'use strict';

var source = require('vinyl-source-stream');
var gulp = require('gulp');
// var gutil = require('gulp-util');
var browserify = require('browserify');
// var reactify = require('reactify');
var watchify = require('watchify');
// var notify = require('gulp-notify');
var shell = require('gulp-shell');
var dbTask = require('gulp-db');
var babelify = require('babelify');

// var scriptsDir = './client/scripts';
// var buildDir = './public';

var dbManager = dbTask({
  //Comment out below and use bottom credentials for Heroku
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'waypointdb',
  dialect: 'mysql'
  // Comment out above and use above for local server
  // host: 'us-cdbr-iron-east-02.cleardb.net',
  // user: 'b220d94c2be53d',
  // password: 'bd11f9e8',
  // database: 'heroku_49f978646a3ea6c'
});

gulp.task('drop', dbManager.drop('waypointdb'));
gulp.task('create', dbManager.create('waypointdb'));
// gulp.task('drop', dbManager.drop('heroku_49f978646a3ea6c'));
// gulp.task('create', dbManager.create('heroku_49f978646a3ea6c'));

gulp.task('reset', ['drop', 'create'], shell.task([
  'echo database test running',
  'node server.js'
]));

gulp.task('populate', shell.task([
  'node db/populate.js'
]));

gulp.task('serve', ['browserify'], shell.task([
  'echo Starting server...',
  'nodemon server.js'
]));

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./client/scripts/app.js'], // Only need initial file, browserify finds the deps
        transform: [babelify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('app.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./public/scripts/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('default', ['serve']);
