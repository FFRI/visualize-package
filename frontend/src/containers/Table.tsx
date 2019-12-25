/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import TableComponent from '../components/Table'
import { useSelector } from 'react-redux'
import { State } from '../modules'

const statsSelector = (state: State) => state.reducer.stats

const Table = () => {
  const stats = useSelector(statsSelector)
  return <TableComponent stats={stats} />
}

export default Table
