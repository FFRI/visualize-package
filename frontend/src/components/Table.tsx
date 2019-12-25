/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Stat } from '../modules'

const styles = theme =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto'
    },
    table: {
      minWidth: 700
    }
  })

const createData = ({
  packageName,
  lastCommit,
  latestPackage,
  maintainers
}: Stat) => {
  return {
    id: packageName,
    packageName,
    lastCommit,
    latestPackage,
    maintainers: maintainers.length
  }
}

interface Props extends WithStyles<typeof styles> {
  stats: Stat[]
}

const SimpleTable: React.FC<Props> = ({ classes, stats }) => {
  const rows = stats.map(stat => createData(stat))
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Package</TableCell>
            <TableCell align="right">Last Commit</TableCell>
            <TableCell align="right">Latest Package</TableCell>
            <TableCell align="right">Maintainers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.packageName}
              </TableCell>
              <TableCell align="right">{row.lastCommit}</TableCell>
              <TableCell align="right">{row.latestPackage}</TableCell>
              <TableCell align="right">{row.maintainers}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(SimpleTable)
