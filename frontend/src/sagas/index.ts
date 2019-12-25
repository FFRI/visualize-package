/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import { call, put, takeEvery } from 'redux-saga/effects'
import {
  fetchNpmInfo,
  fetchRepoInfo,
  fetchGithubToken,
  deleteGithubToken
} from '../client'
import {
  fetch,
  addError,
  addPackage,
  fetchToken,
  setLoggedIn
} from '../modules'
import validate from 'validate-npm-package-name'

const errorDetailExists = (error: any) =>
  'response' in error &&
  error.response &&
  'data' in error.response &&
  error.response.data &&
  'detail' in error.response.data

export function* fetchPackageSaga(action: any) {
  yield put(fetch({ isFetching: true }))
  try {
    if (!validate(action.payload.packageName).validForNewPackages) {
      throw new Error('invalid npm package name')
    }
    const rawNpmInfo = yield call(fetchNpmInfo, action.payload.packageName)
    const urlList = rawNpmInfo.data.url.split('/')
    const repo = urlList[3]
    const githubPackageName = urlList[4]
    const isLoggedIn = action.payload.isLoggedIn
    const rawRepoInfo = yield call(
      fetchRepoInfo,
      repo,
      githubPackageName,
      isLoggedIn ? 10 : 1
    )
    if (rawRepoInfo.data.issues.error) {
      throw new Error(rawRepoInfo.data.issues.message)
    }
    if (rawRepoInfo.data.commits.error) {
      throw new Error(rawRepoInfo.data.commits.message)
    }
    if (rawRepoInfo.data.pulls.error) {
      throw new Error(rawRepoInfo.data.pulls.message)
    }
    yield put(fetch({ isFetching: false }))
    const formatPackageUpdates = rawInfo => {
      const keys = Object.keys(rawInfo).filter(
        key => key !== 'created' && key !== 'modified'
      )
      const items = keys.map(key => rawInfo[key])
      return items
    }
    yield put(
      addPackage({
        package: {
          packageName: action.payload.packageName,
          openPRs: rawRepoInfo.data.pulls.content,
          openIssues: rawRepoInfo.data.issues.content,
          commits: rawRepoInfo.data.commits.content,
          packageUpdates: formatPackageUpdates(rawNpmInfo.data.time),
          lastCommit: rawRepoInfo.data.commits.content[0],
          latestPackage: rawNpmInfo.data.time.modified,
          maintainers: rawNpmInfo.data.maintainers
        }
      })
    )
  } catch (error) {
    console.log(error)
    yield put(fetch({ isFetching: false }))
    if (errorDetailExists(error)) {
      yield put(
        addError({
          err: {
            id: action.payload.packageName,
            msg: error.response.data.detail
          }
        })
      )
    } else {
      yield put(
        addError({
          err: {
            id: action.payload.packageName,
            msg: error.message
          }
        })
      )
    }
  }
}

export function* fetchTokenSaga(action: any) {
  yield put(
    fetchToken({
      isFetchingToken: true
    })
  )
  try {
    yield call(fetchGithubToken, action.payload.clientId, action.payload.code)
    yield put(
      fetchToken({
        isFetchingToken: false
      })
    )
    yield put(
      setLoggedIn({
        isLoggedIn: true
      })
    )
  } catch (error) {
    console.log(error)
    yield put(
      fetchToken({
        isFetchingToken: false
      })
    )
    if (errorDetailExists(error)) {
      yield put(
        addError({
          err: {
            id: 'GitHub Login',
            msg: error.response.data.detail
          }
        })
      )
    } else {
      yield put(
        addError({
          err: {
            id: 'GitHub Login',
            msg: error.message
          }
        })
      )
    }
  }
}

export function* deleteTokenSaga(action: any) {
  yield put(
    fetchToken({
      isFetchingToken: true
    })
  )
  try {
    yield call(deleteGithubToken, action.payload.clientId)
    yield put(
      fetchToken({
        isFetchingToken: false
      })
    )
    yield put(
      setLoggedIn({
        isLoggedIn: false
      })
    )
  } catch (error) {
    console.log(error)
    yield put(
      fetchToken({
        isFetchingToken: false
      })
    )
    if (errorDetailExists(error)) {
      yield put(
        addError({
          err: {
            id: 'GitHub Logout',
            msg: error.response.data.detail
          }
        })
      )
    } else {
      yield put(
        addError({
          err: {
            id: 'GitHub Logout',
            msg: error.message
          }
        })
      )
    }
  }
}

export default function* rootSaga() {
  yield takeEvery('FETCH_PACKAGE_SAGA', fetchPackageSaga)
  yield takeEvery('FETCH_TOKEN_SAGA', fetchTokenSaga)
  yield takeEvery('DELETE_TOKEN_SAGA', deleteTokenSaga)
}
