'use strict'
let crypto = require('crypto')

module.exports = {
  stateParm: (clientID, clientSecret) => {
    return crypto.createHmac('sha256', clientSecret).update(Date.now() + clientID).digest('hex')
  }
}
