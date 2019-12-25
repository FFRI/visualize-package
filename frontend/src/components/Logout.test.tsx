/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import renderer from 'react-test-renderer'
import Logout from './Logout'

it('Snapshot test of Graph', () => {
  const result = renderer.create(<Logout onClick={() => {}} />).toJSON()
  expect(result).toMatchSnapshot()
})
