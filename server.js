require("dotenv").config()
const axios = require("axios")

const TYPEFORM_API_KEY = process.env.TYPEFORM_API_KEY

export default async ({ req, res, log, error }) => {
  const { email } = JSON.parse(req.body)

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

    log(`Form Data Fetched: ${JSON.stringify(response.data.items)}`)

    const responseData = response.data.items
    const userResponses = responseData.find(
      (response) => response.email === email
    )

    if (userResponses) {
      log(`User Responses Found: ${JSON.stringify(userResponses)}`)
      return res.send(JSON.stringify(userResponses))
    } else {
      log(`No responses found for: ${email}`)
      return res.send(
        JSON.stringify({ error: "No responses found for this email" })
      )
    }
  } catch (e) {
    error(`Error: ${e.message}`)
    return res.send(JSON.stringify({ error: "Server error" }))
  }
}
