/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { State, deleteError } from '../modules'
import Paper from '@material-ui/core/Paper'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const errorsSelector = (state: State) => state.reducer.errors

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

const ErrorContainer = ({ classes }) => {
  const errors = useSelector(errorsSelector)
  const dispatch = useDispatch()

  return (
    <Paper className={classes.root}>
      {errors.map(e => (
        <Chip
          key={e.id}
          className={classes.chip}
          color="secondary"
          label={`${e.id}: ${e.msg}`}
          onDelete={() => dispatch(deleteError({ id: e.id }))}
        />
      ))}
    </Paper>
  )
}

export default withStyles(styles)(ErrorContainer)
