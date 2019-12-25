/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import renderer from 'react-test-renderer'
import Search from './Search'

it('Snapshot test of Search', () => {
  const result = renderer
    .create(
      <Search
        onKeyDown={() => {}}
        onClick={() => {}}
        onChange={() => {}}
        isFetching={false}
      />
    )
    .toJSON()
  expect(result).toMatchSnapshot()
})
