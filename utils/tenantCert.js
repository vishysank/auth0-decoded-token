const rp = require('request-promise')

module.exports = {
  get: (clientID) => {
    const tokenValidationOptions = {
      algorithms: 'RS256', // Default Standard for all Nauth Apps
      audience: clientID, // Insert same value as ClientID in here
      clockTolerance: '5',
      ignoreExpiration: false,
      issuer: 'https://nauth-test.auth0.com/', // Default issuer for Clients, Nauth Devs change this to https://nauth-dev.auth0.com/
    }

    //TODO: make this configurable
    return rp('https://nauth-test.auth0.com/.well-known/jwks.json')
    .then((body) => {
      let jsonWebKeySet = JSON.parse(body).keys.find((key) => key.alg == tokenValidationOptions.algorithms)

      if (jsonWebKeySet && jsonWebKeySet.alg.toLowerCase() == tokenValidationOptions.algorithms.toLowerCase()) {
        // NOTE: Convert .CER encoded certificate to .PEM
        return jsonWebKeySet.x5c.map((cert) => {
          return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
        })
      } else {
        console.log(`Missing or invalid json. Response Body = ${response.body}`)
      }
    })
    .catch((err) => {
      //TODO: make this configurable
      console.log('%s accessing %s', err, 'https://nauth-test.auth0.com/.well-known/jwks.json')
    })
  }
}
