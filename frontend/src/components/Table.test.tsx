/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import renderer from 'react-test-renderer'
import Table from './Table'

it('Snapshot test of Table', () => {
  const result = renderer
    .create(
      <Table
        stats={[
          {
            packageName: '@ffri/sample1',
            lastCommit: '2018/12/31',
            latestPackage: '2018/12/01',
            maintainers: ['Adam', 'Bob']
          },
          {
            packageName: '@ffri/sample2',
            lastCommit: '2018/12/31',
            latestPackage: '2018/12/01',
            maintainers: ['Adam', 'Bob']
          }
        ]}
      />
    )
    .toJSON()
  expect(result).toMatchSnapshot()
})
