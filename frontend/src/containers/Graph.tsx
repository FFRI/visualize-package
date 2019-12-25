/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import GraphComponent from '../components/Graph'
import { useSelector } from 'react-redux'
import { State } from '../modules'
import Grid from '@material-ui/core/Grid'
import {
  makeGraphDataFromStrings,
  makeGraphDataFromObjects
} from '../utils/MakeGraphData'

const packageInfoSelector = (state: State) => ({
  packageUpdates: state.reducer.packageUpdates,
  commits: state.reducer.commits,
  openIssues: state.reducer.openIssues,
  openPRs: state.reducer.openPRs
})

const Graph = () => {
  const { packageUpdates, commits, openIssues, openPRs } = useSelector(
    packageInfoSelector
  )
  const updates = makeGraphDataFromStrings(packageUpdates)
  const commitList = makeGraphDataFromStrings(commits)
  const issues = makeGraphDataFromObjects(openIssues)
  const pulls = makeGraphDataFromObjects(openPRs)
  type SafeGraphProps = {
    title: string
    data: string[][]
  }
  /*
    GraphComponents with 2*2 data will generate a error.
    ex)
    <GraphComponent data={
      [
        ['x', 'y'],
        [new Date(), 0]
      ]
    } />
  */
  const SafeGraph = ({ title, data }: SafeGraphProps) => (
    <>
      {data.length > 2 ? (
        <GraphComponent
          title={title}
          data={
            data.toString() === [['x']].toString()
              ? [
                  ['x', 'y'],
                  [0, 0]
                ]
              : data
          }
        />
      ) : (
        <div>Too Few Data To Draw A Chart</div>
      )}
    </>
  )

  return (
    <>
      <Grid item xs={12} md={6}>
        <Grid container justify="center">
          <SafeGraph title="Open PRs" data={pulls} />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container justify="center">
          <SafeGraph title="Open Issues" data={issues} />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container justify="center">
          <SafeGraph title="Commits" data={commitList} />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container justify="center">
          <SafeGraph title="Package Updates" data={updates} />
        </Grid>
      </Grid>
    </>
  )
}

export default Graph
