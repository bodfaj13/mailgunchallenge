import crypto from 'crypto'

/**
 * Middleware to validate mail source
 * @param timestamp string
 * @param token string
 * @param signature string
 * @returns boolean
 */
const validateMailSource = (timestamp: string, token: string, signature: string): boolean => {
  const value = timestamp + token

  // use sha256 to carry out verification 
  const hash = crypto.createHmac('sha256',
    process.env.MAILGUN_API_KEY || '')
    .update(value)
    .digest('hex')

  // comapare hash with signature
  return hash === signature
}

export default validateMailSource