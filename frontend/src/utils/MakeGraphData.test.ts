/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import {
  makeGraphDataFromObjects,
  makeGraphDataFromStrings
} from './MakeGraphData'

describe('makeGraphDateFromObjects()', () => {
  it('should succeed', () => {
    expect(
      makeGraphDataFromObjects([
        {
          packageName: '@ffri/sample1',
          data: [
            {
              createdAt: '2018/10/03',
              closedAt: '2018/10/10'
            },
            {
              createdAt: '2018/10/04',
              closedAt: null
            },
            {
              createdAt: '2018/11/05',
              closedAt: '2018/12/20'
            }
          ]
        },
        {
          packageName: '@ffri/sample2',
          data: [
            {
              createdAt: '2018/09/03',
              closedAt: null
            },
            {
              createdAt: '2018/09/04',
              closedAt: '2018/11/05'
            },
            {
              createdAt: '2018/11/05',
              closedAt: null
            }
          ]
        }
      ]).toString()
    ).toBe(
      [
        ['x', '@ffri/sample1', '@ffri/sample2'],
        [new Date('2018/09'), 0, 2],
        [new Date('2018/10'), 2, 2],
        [new Date('2018/11'), 2, 3],
        [new Date('2018/12'), 2, 2]
      ].toString()
    )
  })
})

describe('makeGraphDataFromStrings()', () => {
  it('should succeed', () => {
    expect(
      makeGraphDataFromStrings([
        {
          packageName: '@ffri/sample1',
          data: ['2018/09/10', '2018/09/20', '2018/12/01']
        },
        {
          packageName: '@ffri/sample2',
          data: ['2018/08/10', '2018/09/22', '2018/11/09', '2018/12/02']
        }
      ]).toString()
    ).toBe(
      [
        ['x', '@ffri/sample1', '@ffri/sample2'],
        [new Date('2018/08'), 0, 1],
        [new Date('2018/09'), 2, 1],
        [new Date('2018/10'), 0, 0],
        [new Date('2018/11'), 0, 1],
        [new Date('2018/12'), 1, 1]
      ].toString()
    )
  })
})
