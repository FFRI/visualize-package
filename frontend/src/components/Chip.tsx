/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import { withStyles, WithStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import { PropTypes, createStyles } from '@material-ui/core'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    chip: {
      margin: theme.spacing(1)
    }
  })

interface Props extends WithStyles<typeof styles> {
  label: React.ReactNode
  onDelete: (event: any) => void
  color: PropTypes.Color
}

const ChipComponent: React.FC<Props> = ({
  classes,
  label,
  onDelete,
  color
}) => (
  <div className={classes.root}>
    <Chip
      label={label}
      onDelete={onDelete}
      className={classes.chip}
      color={color}
    />
  </div>
)

export default withStyles(styles)(ChipComponent)
