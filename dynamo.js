const AWS = require('aws-sdk')

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const TABLE_NAME = process.env.TABLE_NAME

/**
 * Saves or update the raw data (mailgun webhook request) to the db
 * @param data Object 
 * @returns 
 */
const addOrUpdateMail = async (data) => {
  const params = {
    TableName: TABLE_NAME || '',
    Item: data
  }

  return await dynamoClient.put(params).promise()
}

module.exports = addOrUpdateMail