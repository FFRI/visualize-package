/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import Button from '@material-ui/core/Button'
import { clientId, redirectUrl } from '../utils/config'
import { oauthLoginUrl } from '@octokit/oauth-login-url'
import Tooltip from '@material-ui/core/Tooltip'

interface Props {
  state: string
}

const LoginButton: React.FC<Props> = ({ state }) => {
  const { url } = oauthLoginUrl({
    clientId,
    redirectUrl,
    scopes: ['repo'],
    state,
    log: {
      warn(message) {
        console.log(message, { level: 'warn' })
      }
    }
  })

  return (
    <div>
      <Tooltip title="Enable GitHub OAuth" aria-label="login">
        <Button variant="contained" href={url} disabled={!clientId}>
          Authorize App
        </Button>
      </Tooltip>
    </div>
  )
}

export default LoginButton
