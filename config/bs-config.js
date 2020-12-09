const path = require('path')
//var dir = path.join(path.dirname(require.main.filename), 'views')

module.exports = {
  proxy: 'localhost:8000',
  files: ['**/*.css', '**/*.pug', '**/*.js'],
  ignore: ['node_modules'],
  reloadDelay: 10,
  ui: false,
  notify: false,
  port: 3000
}
