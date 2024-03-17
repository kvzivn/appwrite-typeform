require("dotenv").config()
const axios = require("axios")

const TYPEFORM_API_KEY = process.env.TYPEFORM_API_KEY

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body)

  try {
    const response = await axios.get(
      "https://api.typeform.com/forms/70y3ggn7l5c/responses",
      {
        headers: {
          Authorization: `Bearer ${TYPEFORM_API_KEY}`,
        },
        params: {
          included_response_id: email,
        },
      }
    )

    const responseData = response.data.items
    const userResponses = responseData.find(
      (response) => response.email === email
    )

    if (userResponses) {
      return {
        statusCode: 200,
        body: JSON.stringify(userResponses),
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No responses found for this email" }),
      }
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    }
  }
}
