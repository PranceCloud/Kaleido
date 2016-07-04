var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('default', function () {
  gulp.watch('wjs/**/*.js', function (event) {
    console.log('File Gen wui.js , running tasks...');
    exec("uglifyjs wjs/*.js -b -c > wui.js");
    //exec("uglifyjs  wjs/modelComponse.js wjs/projectComponse.js wjs/wui.main.js wjs/start.js -b -c > wui.js");
  });
  gulp.watch('kadmin.coffee', function (event) {
    console.log('File Gen kadmin.coffee , running tasks...');
    exec("coffee -c -b kadmin.coffee");
    //exec("uglifyjs  wjs/modelComponse.js wjs/projectComponse.js wjs/wui.main.js wjs/start.js -b -c > wui.js");
  });
});


