const { src, dest, parallel, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const eslint = require("gulp-eslint");
const mocha = require("gulp-mocha");
function testTask(cb) {
    console.log("task finished")
    cb();//chiamata la callback cosí va in success
    //cb(new Error('Something bad has happened')); //cosí va in errore
}

function copy(cb) {//copia tutti i js in copies
    src('routes/*.js')
        .pipe(dest('copies'));
    cb();
}

function generateCSS(cb) {//compila il sass
    src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/stylesheets'));
    cb();
}

function generateHTML(cb) {//da *.ejs compila html
    src("./views/index.ejs")
        .pipe(ejs({
            title: "Ciao CI modulo 2!",
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(dest("public"));
    cb();
}

function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}

function runTests(cb) {
    return src(['**/*.test.js'])
        .pipe(mocha())
        .on('error', function() {
            cb(new Error('Test failed'));
        })
        .on('end', function() {
            cb();
        });
}

exports.test = runTests;
exports.lint = runLinter;
exports.html = generateHTML;
exports.css = generateCSS;
exports.copy = copy;
exports.test = testTask;

exports.default = series(runLinter,parallel(generateCSS,generateHTML),runTests);