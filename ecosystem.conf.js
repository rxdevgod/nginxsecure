module.exports = {
  apps: [{
    name: 'nginxSecuritySecret',
    script: 'node index.js',
    version: 'v1.0',
    ignore_watch: [
      'node_modules'
    ]
  }]
}
