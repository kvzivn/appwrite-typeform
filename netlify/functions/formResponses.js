const fetch = require("node-fetch")

exports.handler = async function (event) {
  const email = event.queryStringParameters.email
  const TYPEFORM_API_KEY = process.env.TYPEFORM_API_KEY

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  }

  try {
    const response = await fetch(
      `https://api.typeform.com/forms/uZg4jefe/responses?included_response_id=${email}`,
      {
        headers: {
          Authorization: `Bearer ${TYPEFORM_API_KEY}`,
        },
      }
    )

    const data = await response.json()

    console.log(`Form Data Fetched: ${JSON.stringify(data.items)}`)

    const responseData = data.items
    const userResponses = responseData.find(
      (response) => response.email === email
    )

    if (userResponses) {
      console.log(`User Responses Found: ${JSON.stringify(userResponses)}`)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(userResponses),
      }
    } else {
      console.log(`No responses found for: ${email}`)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No responses found for this email" }),
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error" }),
    }
  }
}
