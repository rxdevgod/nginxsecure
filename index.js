const express = require('express')
const crypto = require('crypto')
const path = require('path')
const app = express()
require('dotenv').config()

// const nginxSecuritySecret = 'Supernova123!'
// const mediaHost = 'http://139.59.114.247:8000/video/hls'

// /////////
// SERVER //
// /////////
const { NGINX_SECRET, MEDIA_HOST } = process.env
if (!NGINX_SECRET || !MEDIA_HOST) {
  throw new Error('Update config in .env')
}

app.get('/api/secret/get/*', (req, res, next) => {
  if (typeof req.params[0] !== 'undefined') {
    // NOTE: careful with spoofed when listen 'x-forwarded-for' from outside
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const secret = getStreamUrl(MEDIA_HOST, req.params[0], ip, NGINX_SECRET)
    res.json({ status: 1, data: { secret: secret } })
  } else {
    res.json({ status: 0, data: { secret: '' }, extra: { msg: 'Filename empty !' } })
  }
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

// ////////////
// ULTI FUNC //
// ////////////
function generateSecurePathHash (expires, clientIp, secret) {
  if (!expires || !clientIp || !secret) throw new Error('Must provide all token components')
  var input = expires + clientIp + ' ' + secret
  var binaryHash = crypto.createHash('md5').update(input).digest()
  var base64Value = Buffer.from(binaryHash).toString('base64')
  return base64Value.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function getStreamUrl (mediaHost, originalUrl, ip, secret) {
  const expiresTimestamp = new Date(Date.now() + (1000 * 60 * 30)).getTime()
  const expires = String(Math.round(expiresTimestamp / 1000))
  const token = generateSecurePathHash(expires, ip, secret)
  console.log('HASH: ', expires, ip, secret, token)
  return `${mediaHost}/${path.join(token, expires, originalUrl)}`
}
