import AWS from 'aws-sdk'

// Dynamodb instance and table name
const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = process.env.TABLE_NAME

/**
 * Saves or update the raw data (mailgun webhook request) to the db
 * @param data Object 
 * @returns 
 */
const addOrUpdateMail = async (data: any) => {
  // param set up for data to be saved in Dynamodb
  const params = {
    TableName: TABLE_NAME || '',
    Item: data
  }
  
  // Dynamodb save 
  return await dynamoClient.put(params).promise()
}

export default addOrUpdateMail