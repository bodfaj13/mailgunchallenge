const crypto = require('crypto')

/**
 * Middleware to validate mail source
 * @param timestamp string
 * @param token string
 * @param signature string
 * @returns boolean
 */
const validateMailSource = async (timestamp, token, signature) => {
  const value = timestamp + token

  const hash = crypto.createHmac('sha256',
    process.env.MAILGUN_API_KEY || '')
    .update(value)
    .digest('hex')

  return hash === signature
}

module.exports = validateMailSource