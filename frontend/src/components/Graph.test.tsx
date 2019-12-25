/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import renderer from 'react-test-renderer'
import Graph from './Graph'

it('Snapshot test of Graph', () => {
  const result = renderer
    .create(
      <Graph
        data={[
          ['x', 'y'],
          [new Date('2018/09'), 10],
          [new Date('2018/10'), 5]
        ]}
        title="Chart"
      />
    )
    .toJSON()
  expect(result).toMatchSnapshot()
})
