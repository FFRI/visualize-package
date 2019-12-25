/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

const clientId = process.env.NPM_DEVS_VISUALIZER_CLIENT_ID
const redirectUrl =
  process.env.NPM_DEVS_VISUALIZER_REDIRECT_URL || 'http://localhost:1234/'
const backendUrl =
  process.env.NPM_DEVS_VISUALIZER_BACKEND_URL || 'http://localhost:8000'
export { clientId, redirectUrl, backendUrl }
