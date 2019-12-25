/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

interface Props {
  onClick: any
}

const LogoutButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div>
      <Tooltip title="Disable GitHub OAuth" aria-label="logout">
        <Button variant="contained" onClick={onClick} color="primary">
          Deauthorize App
        </Button>
      </Tooltip>
    </div>
  )
}

export default LogoutButton
