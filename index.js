const addOrUpdateMail = require('./dynamo')
const publishData = require('./sns')
const validateMailSource = require('./auth')

const handler = async (event) => {
  const requestData = JSON.parse(event.body)

  const { timestamp, token, signature } = requestData['signature']

  const { id } = requestData['event-data']
  const eventType = requestData['event-data'].event

  if (validateMailSource(timestamp, token, signature)) {
    console.log('auth passed')
    try {
      const snsData = {
        Provider: 'Mailgun',
        timestamp,
        type: eventType
      }

      const publishTemplate = {
        message: `${JSON.stringify(snsData, null, 4)}`,
        subject: 'Mailgun Challenge Publish'
      }

      await addOrUpdateMail({
        id,
        ...event
      })

      await publishData(publishTemplate)

      console.log('save and publish passed')

      return {
        status: 200,
        event,
        message: 'data saved and published successfully'
      }
    } catch (error) {
      console.log('save and publish failed')
      return {
        status: 400,
        message: 'Something went wrong'
      }
    }
  } else {
    console.log('auth failed')
    return {
      status: 401,
      message: 'Mail webhook source not authenticated'
    }
  }
}

module.exports = {
  handler
}