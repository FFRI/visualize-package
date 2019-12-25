/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { State, deletePackage } from '../modules'
import Paper from '@material-ui/core/Paper'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const styles = createStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(1 / 2)
  },
  chip: {
    margin: theme.spacing(1 / 2)
  }
}))

const packagesSelector = (state: State) => state.reducer.packages

const ChipContainer = ({ classes }) => {
  const packages = useSelector(packagesSelector)
  const dispatch = useDispatch()
  return (
    <Paper className={classes.root}>
      {packages.map(packageName => (
        <Chip
          key={packageName}
          className={classes.chip}
          color={'primary'}
          label={packageName}
          onDelete={() => dispatch(deletePackage({ packageName }))}
        />
      ))}
    </Paper>
  )
}

export default withStyles(styles)(ChipContainer)
