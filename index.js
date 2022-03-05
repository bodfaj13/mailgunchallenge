const addOrUpdateMail = require('./dynamo')
const publishData = require('./sns')
const validateMailSource = require('./auth')

const handler = async (event) => {
  const requestData = JSON.parse(event.body)

  const { timestamp, token, signature } = requestData['signature']

  const { id, event } = requestData['event-data']

  if (validateMailSource(timestamp, token, signature)) {
    try {
      const snsData = {
        Provider: 'Mailgun',
        timestamp,
        type: event
      }

      const publishTemplate = {
        message: `${JSON.stringify(snsData, null, 4)}`,
        subject: 'Mailgun Challenge Publish'
      }

      await addOrUpdateMail({
        id,
        ...requestData
      })

      await publishData(publishTemplate)

      return {
        status: 200,
        event,
        message: 'data saved and published successfully'
      }
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong'
      }
    }
  } else {
    return {
      status: 401,
      message: 'Mail webhook source not authenticated'
    }
  }
}

module.exports = {
  handler
}