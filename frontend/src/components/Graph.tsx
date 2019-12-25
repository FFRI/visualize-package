/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import Chart from 'react-google-charts'
import Paper from '@material-ui/core/Paper'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'

const styles = theme =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(1 / 2)
    }
  })

interface Props extends WithStyles<typeof styles> {
  title: string
  data: {} | any[]
}

const Graph: React.FC<Props> = ({ title, data, classes }) => {
  return (
    <Paper className={classes.root}>
      <Chart
        width={'500px'}
        height={'400px'}
        chartType="LineChart"
        loader={<div>Drawing Chart...</div>}
        data={data}
        options={{
          title,
          vAxis: {
            title: 'Number'
          },
          hAxis: {
            title: 'Time'
          },
          explorer: {
            axis: 'horizontal',
            actions: ['dragToZoom', 'rightClickToReset']
          }
        }}
        rootProps={{ 'data-testid': '2' }}
      />
    </Paper>
  )
}

export default withStyles(styles)(Graph)
