const axios = require("axios")

exports.handler = async function (event, context) {
  const email = JSON.parse(event.body).email
  const TYPEFORM_API_KEY = process.env.TYPEFORM_API_KEY

  try {
    const response = await axios.get(
      "https://api.typeform.com/forms/uZg4jefe/responses",
      {
        headers: {
          Authorization: `Bearer ${TYPEFORM_API_KEY}`,
        },
        params: {
          included_response_id: email,
        },
      }
    )

    console.log(`Form Data Fetched: ${JSON.stringify(response.data.items)}`)

    const responseData = response.data.items
    const userResponses = responseData.find(
      (response) => response.email === email
    )

    if (userResponses) {
      console.log(`User Responses Found: ${JSON.stringify(userResponses)}`)
      return {
        statusCode: 200,
        body: JSON.stringify(userResponses),
      }
    } else {
      console.log(`No responses found for: ${email}`)
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No responses found for this email" }),
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    }
  }
}
