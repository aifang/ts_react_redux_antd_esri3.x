var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    rm = require('rimraf')
var tsProject = ts.createProject('tsconfig_gis.json');

let _envProd = gulp.env.env === 'production' ? true : false
let _destPath = _envProd ? "build" : 'public';

gulp.task('clean', function () {
    ['/gis']
        .map(n => 'public' + n)
        .forEach(n => {
            rm.sync(n);
        })
    console.log('gis模块删除完成....');
});

gulp.task('ts_dev', function () {

    var tsResult = gulp.src(["src/gis/**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest(_destPath + '/gis'))
        .on('finish', () => { console.log('gis模块编译完成') })
});

gulp.task('ts_prod', function () {
    var tsResult = gulp.src(["src/gis/**/*.ts"])
        .pipe(tsProject());
    return tsResult.js
        .pipe(uglify())
        .pipe(gulp.dest(_destPath + '/gis'))
        .on('finish', () => { console.log('gis模块编译完成') })
});


gulp.task('release', function () {
    // rm.sync("../web/arcgis")

    // gulp.src(["build/**/*.*", "!build/**/*.map", "!build/Interface/*.*"])
    //     // gulp.src(["build/**/*.*","!build/Interface/*.*"])
    //     .pipe(gulp.dest(
    //         "../web/arcgis"
    //     ))
});

gulp.task('dev', ['ts_dev']);

gulp.task('watch', ['dev'], function () {
    gulp.watch(tsProject.config.include, ['dev']);
});

gulp.task('default', ['ts_prod']);