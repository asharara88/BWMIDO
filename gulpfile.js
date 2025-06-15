const { src, dest, series } = require('gulp');

function defaultTask(cb) {
  console.log('Gulp is running!');
  cb();
}

exports.default = defaultTask;
