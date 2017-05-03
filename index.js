'use strict'
const crypto = require('crypto')
const rp = require('request-promise')
const tenantCert = require('./utils/tenantCert')
const jwt = require('jsonwebtoken')

module.exports = {
  stateParm: (clientID, clientSecret) => {
    return crypto.createHmac('sha256', clientSecret).update(Date.now() + clientID).digest('hex')
  },
  getToken: (clientID, clientSecret, accessCode) => {
    const options = {
      //TODO: Make this config based
      uri: 'https://nauth-test.auth0.com/oauth/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        client_id: clientID,
        client_secret: clientSecret,
        code: accessCode,
        redirect_uri: 'http://localhost:3000/callback'
      }
    }

    rp(options)
    .then((body) => {
      return [tenantCert.get(config), body]
    })
    .spread((cert, body) => {
      jwt.verify(JSON.parse(body).id_token, cert[0], tokenValidationOptions, (error, decoded) => {
        if (err) return error
        return decoded
      })
    })
  }
}
