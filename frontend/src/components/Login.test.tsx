/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import renderer from 'react-test-renderer'
import Login from './Login'

it('Snapshot test of Login', () => {
  const result = renderer.create(<Login state="abcdefg" />).toJSON()
  expect(result).toMatchSnapshot()
})
