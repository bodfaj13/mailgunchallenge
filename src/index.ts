import addOrUpdateMail from './dynamo'
import publishData from './sns'
import validateMailSource from './auth'

const handler = async (event: any) => {
  const requestData = JSON.parse(event.body)

  const { timestamp, token, signature }: {timestamp: string, token: string, signature: string} = requestData['signature']

  const { id } = requestData['event-data']
  const eventType = requestData['event-data'].event

  if (validateMailSource(timestamp, token, signature)) {
    console.log('auth passed')
    try {
      const snsData: {
        Provider: string,
        timestamp: string,
        type: string
      } = {
        Provider: 'Mailgun',
        timestamp,
        type: eventType
      }

      const publishTemplate: {
        message: string,
        subject: string
      } = {
        message: `${JSON.stringify(snsData, null, 4)}`,
        subject: 'Mailgun Challenge Publish'
      }

      await addOrUpdateMail({
        id,
        ...requestData
      })

      await publishData(publishTemplate)

      console.log('save and publish passed')

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'data saved and published successfully'
        })
      }

    } catch (error) {

      console.log(error)

      console.log('save and publish failed')

      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'data not saved and not published successfully'
        })
      }
    }
  } else {
    console.log('auth failed')

    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'auth failed'
      })
    }
  }
}

export default handler