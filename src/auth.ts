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

  console.log(process.env.MAILGUN_API_KEY)

  const hash = crypto.createHmac('sha256',
    process.env.MAILGUN_API_KEY || '')
    .update(value)
    .digest('hex')

  return hash === signature
}

export default validateMailSource