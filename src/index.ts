import addOrUpdateMail from './dynamo'
import publishData from './sns'
import validateMailSource from './auth'

/**
 * Webhook handler
 * @param event Object
 * @returns http response
 */
const handler = async (event: any) => {
  // parse the date coming from the events
  const requestData = JSON.parse(event.body)

  // extract the required variables needed for the SNS and Dynamodb
  const { timestamp, token, signature }: { timestamp: string, token: string, signature: string } = requestData['signature']
  const { id } = requestData['event-data']
  const eventType = requestData['event-data'].event

  // validate the auth for the mail source
  if (validateMailSource(timestamp, token, signature)) {
    try {

      // SNS date setup
      const snsData: {
        Provider: string,
        timestamp: string,
        type: string
      } = {
        Provider: 'Mailgun',
        timestamp,
        type: eventType
      }

      // SNS pub template (for email subcription made to SNS)
      const publishTemplate: {
        message: string,
        subject: string
      } = {
        message: `${JSON.stringify(snsData, null, 4)}`,
        subject: 'Mailgun Challenge Publish'
      }

      // save date to Dynamodb
      await addOrUpdateMail({
        id,
        ...requestData
      })

      // publish data to SNS
      await publishData(publishTemplate)

      // return response
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'data saved and published successfully'
        })
      }

    } catch (error) {
      console.log(error)
      // return response
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'data not saved and not published successfully'
        })
      }
    }
  } else {
    // return response
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'auth failed'
      })
    }
  }
}

export default handler