/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    width: 400
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
}

interface Props extends WithStyles<typeof styles> {
  onKeyDown: (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  isFetching: boolean
}

const SearchComponent: React.FC<Props> = ({
  classes,
  onKeyDown,
  onClick,
  onChange,
  isFetching
}) => (
  <Paper className={classes.root} elevation={1}>
    <InputBase
      className={classes.input}
      placeholder="Search NPM Packages"
      onKeyDown={onKeyDown}
      onChange={onChange}
    />
    {isFetching ? (
      <CircularProgress />
    ) : (
      <IconButton
        className={classes.iconButton}
        aria-label="Search"
        onClick={onClick}
      >
        <SearchIcon />
      </IconButton>
    )}
  </Paper>
)

export default withStyles(styles)(SearchComponent)
