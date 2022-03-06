import AWS from 'aws-sdk'

const sns = new AWS.SNS();

/**
 * Publish data to AWS SNS
 * @param string message
 * @param string subject 
 * @returns promise
 */
const publishData = async ({ message, subject }: { message: string, subject: string }) => {
  const params: {
    Message: string,
    Subject: string,
    TopicArn: string
  } = {
    Message: message,
    Subject: subject,
    TopicArn: process.env.AWS_SNS_TOPIC_ARN || '',
  }

  return await sns.publish(params).promise()
}

export default publishData