if (process.env.NODE_ENV == "test") {
  require('dotenv').config({ path: ".env.test" })
} else {
  require('dotenv').config()
}

const getStorage = () => {
  return process.env.NODE_ENV == "test" ? ":memory:" : "./db/database.dev.sqlite"
}

export default {
  name: "api_gateway",
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  storage: getStorage(),
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  crmUri: process.env.CRM_URI,
  vkUri: process.env.VK_URI,
  instaUri: process.env.INSTA_URI,
}