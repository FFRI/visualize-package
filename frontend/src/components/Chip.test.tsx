/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import renderer from 'react-test-renderer'
import Chip from './Chip'

it('Snapshot test of Chip', () => {
  const result = renderer
    .create(<Chip label="@ffri/sample" onDelete={() => {}} color="primary" />)
    .toJSON()
  expect(result).toMatchSnapshot()
})
