/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import { fetchPackageSaga, fetchTokenSaga, deleteTokenSaga } from './index'
import {
  fetchNpmInfo,
  fetchRepoInfo,
  fetchGithubToken,
  deleteGithubToken
} from '../client'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { call } from 'redux-saga/effects'

it('fetching package info succeeded', () =>
  expectSaga(fetchPackageSaga, {
    type: 'FETCH_PACKAGE_SAGA',
    payload: {
      packageName: '@ffri/sample',
      isLoggedIn: false
    }
  })
    .provide([
      [
        call(fetchNpmInfo, '@ffri/sample'),
        {
          data: {
            time: {
              modified: '2019-06-04T11:51:28.541Z',
              created: '2011-10-26T17:46:21.942Z',
              '0.0.1': '2011-10-26T17:46:22.746Z',
              '0.0.2': '2011-10-28T22:40:36.115Z',
              '0.0.3': '2011-10-29T13:40:41.073Z',
              '0.1.2': '2011-12-21T20:56:27.003Z'
            },
            maintainers: [{ name: 'adam', email: 'adam@example.com' }],
            url: 'https://github.com/ffri/sample'
          }
        }
      ],
      [
        call(fetchRepoInfo, 'ffri', 'sample', 1),
        {
          data: {
            commits: {
              content: ['2011-12-21T20:56:27.003Z'],
              limit: false,
              error: false,
              message: ''
            },
            pulls: {
              content: [
                {
                  createdAt: '2019-06-04T22:51:10Z',
                  closedAt: '2019-06-04T22:58:11Z'
                }
              ],
              limit: false,
              error: false,
              message: ''
            },
            issues: {
              content: [
                {
                  createdAt: '2019-06-04T22:51:10Z',
                  closedAt: '2019-06-04T22:58:11Z'
                }
              ],
              limit: false,
              error: false,
              message: ''
            }
          }
        }
      ]
    ])
    .put({ type: 'FETCH', payload: { isFetching: true } })
    .put({ type: 'FETCH', payload: { isFetching: false } })
    .put({
      type: 'ADD_PACKAGE',
      payload: {
        package: {
          packageName: '@ffri/sample',
          openPRs: [
            {
              createdAt: '2019-06-04T22:51:10Z',
              closedAt: '2019-06-04T22:58:11Z'
            }
          ],
          openIssues: [
            {
              createdAt: '2019-06-04T22:51:10Z',
              closedAt: '2019-06-04T22:58:11Z'
            }
          ],
          commits: ['2011-12-21T20:56:27.003Z'],
          packageUpdates: [
            '2011-10-26T17:46:22.746Z',
            '2011-10-28T22:40:36.115Z',
            '2011-10-29T13:40:41.073Z',
            '2011-12-21T20:56:27.003Z'
          ],
          lastCommit: '2011-12-21T20:56:27.003Z',
          latestPackage: '2019-06-04T11:51:28.541Z',
          maintainers: [{ name: 'adam', email: 'adam@example.com' }]
        }
      }
    })
    .run())

it('fetching package info failed', () =>
  expectSaga(fetchPackageSaga, {
    type: 'FETCH_PACKAGE_SAGA',
    payload: {
      packageName: '@ffri/sample',
      isLoggedIn: false
    }
  })
    .provide([
      [
        call(fetchNpmInfo, '@ffri/sample'),
        {
          data: {
            time: {
              modified: '2019-06-04T11:51:28.541Z',
              created: '2011-10-26T17:46:21.942Z',
              '0.0.1': '2011-10-26T17:46:22.746Z',
              '0.0.2': '2011-10-28T22:40:36.115Z',
              '0.0.3': '2011-10-29T13:40:41.073Z',
              '0.1.2': '2011-12-21T20:56:27.003Z'
            },
            maintainers: [{ name: 'adam', email: 'adam@example.com' }],
            url: 'https://github.com/ffri/sample'
          }
        }
      ],
      [
        call(fetchRepoInfo, 'ffri', 'sample', 1),
        {
          data: {
            commits: {
              content: ['2011-12-21T20:56:27.003Z'],
              limit: false,
              error: false,
              message: ''
            },
            pulls: {
              content: [
                {
                  createdAt: '2019-06-04T22:51:10Z',
                  closedAt: '2019-06-04T22:58:11Z'
                }
              ],
              limit: false,
              error: false,
              message: ''
            },
            issues: {
              content: [
                {
                  createdAt: '2019-06-04T22:51:10Z',
                  closedAt: '2019-06-04T22:58:11Z'
                }
              ],
              limit: false,
              error: true,
              message: 'GitHub API rate limit exceeded.'
            }
          }
        }
      ]
    ])
    .put({ type: 'FETCH', payload: { isFetching: true } })
    .put({ type: 'FETCH', payload: { isFetching: false } })
    .put({
      type: 'ADD_ERROR',
      payload: {
        err: {
          id: '@ffri/sample',
          msg: 'GitHub API rate limit exceeded.'
        }
      }
    })
    .run())

it('npm package name with # failed', () =>
  expectSaga(fetchPackageSaga, {
    type: 'FETCH_PACKAGE_SAGA',
    payload: {
      packageName: 'ffri#123',
      isLoggedIn: false
    }
  })
    .put({
      type: 'ADD_ERROR',
      payload: {
        err: {
          id: 'ffri#123',
          msg: 'invalid npm package name'
        }
      }
    })
    .run())

it('npm package name with % failed', () =>
  expectSaga(fetchPackageSaga, {
    type: 'FETCH_PACKAGE_SAGA',
    payload: {
      packageName: 'ffri%123',
      isLoggedIn: false
    }
  })
    .put({
      type: 'ADD_ERROR',
      payload: {
        err: {
          id: 'ffri%123',
          msg: 'invalid npm package name'
        }
      }
    })
    .run())

it('fetching Token info succeeded', () =>
  expectSaga(fetchTokenSaga, {
    type: 'FETCH_TOKEN_SAGA',
    payload: {
      clientId: 'aaaaaa',
      code: 'cccccc'
    }
  })
    .provide([
      [
        call(fetchGithubToken, 'aaaaaa', 'cccccc'),
        {
          data: {
            // eslint-disable-next-line
            message: 'OK'
          }
        }
      ]
    ])
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: true } })
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: false } })
    .put({ type: 'SET_LOGGED_IN', payload: { isLoggedIn: true } })
    .run())

const error = new Error('Oops!')

it('fetching token info failed', () =>
  expectSaga(fetchTokenSaga, {
    type: 'FETCH_TOKEN_SAGA',
    payload: {
      clientId: 'aaaaaa',
      code: 'cccccc'
    }
  })
    .provide([[call(fetchGithubToken, 'aaaaaa', 'cccccc'), throwError(error)]])
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: true } })
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: false } })
    .put({
      type: 'ADD_ERROR',
      payload: {
        err: {
          id: 'GitHub Login',
          msg: error.message
        }
      }
    })
    .run())

it('deleting Token Info succeeded', () =>
  expectSaga(deleteTokenSaga, {
    type: 'DELETE_TOKEN_SAGA',
    payload: {
      clientId: 'aaaaaa',
      token: 'bbbbbb'
    }
  })
    .provide([
      [
        call(deleteGithubToken, 'aaaaaa'),
        {
          data: {
            message: 'No Content'
          }
        }
      ]
    ])
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: true } })
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: false } })
    .put({ type: 'SET_LOGGED_IN', payload: { isLoggedIn: false } })
    .run())

it('deleting Token Info failed', () =>
  expectSaga(deleteTokenSaga, {
    type: 'DELETE_TOKEN_SAGA',
    payload: {
      clientId: 'aaaaaa'
    }
  })
    .provide([[call(deleteGithubToken, 'aaaaaa'), throwError(error)]])
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: true } })
    .put({ type: 'FETCH_TOKEN', payload: { isFetchingToken: false } })
    .put({
      type: 'ADD_ERROR',
      payload: {
        err: {
          id: 'GitHub Logout',
          msg: error.message
        }
      }
    })
    .run())
