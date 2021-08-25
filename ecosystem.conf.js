module.exports = {
  apps: [{
    name: 'nginxSecuritySecretGen',
    script: './index.js',
    env_production: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }]
}
