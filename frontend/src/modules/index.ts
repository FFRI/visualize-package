/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import actionCreatorFactory from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

const actionCreator = actionCreatorFactory()

export const fetch = actionCreator<{ isFetching: boolean }>('FETCH')
export const addPackage = actionCreator<{ package: PackageAllInfo }>(
  'ADD_PACKAGE'
)
export const deletePackage = actionCreator<{ packageName: string }>(
  'DELETE_PACKAGE'
)
export const deleteError = actionCreator<{ id: string }>('DELETE_ERROR')
export const addError = actionCreator<{ err: Err }>('ADD_ERROR')
export const fetchToken = actionCreator<{ isFetchingToken: boolean }>(
  'FETCH_TOKEN'
)

export const setLoggedIn = actionCreator<{ isLoggedIn: boolean }>(
  'SET_LOGGED_IN'
)

type Err = {
  id: string
  msg: string
}

type PackageCommitData = {
  packageName: string
  data: string[]
}

export type PackageUpdateData = PackageCommitData

type Duration = {
  createdAt: string
  closedAt: string | null
}

type PackagePRData = {
  packageName: string
  data: Duration[]
}

export type PackageIssueData = PackagePRData

export type Stat = {
  packageName: string
  lastCommit: string
  latestPackage: string
  maintainers: string[]
}

export type AppState = {
  isFetching: boolean
  packages: string[]
  errors: Err[]
  openPRs: PackagePRData[]
  openIssues: PackageIssueData[]
  commits: PackageCommitData[]
  packageUpdates: PackageUpdateData[]
  stats: Stat[]
  isFetchingToken: boolean
  isLoggedIn: boolean
}

export type State = {
  reducer: AppState
  router: any
}

type PackageAllInfo = {
  packageName: string
  openPRs: Duration[]
  openIssues: Duration[]
  commits: string[]
  packageUpdates: string[]
  lastCommit: string
  latestPackage: string
  maintainers: string[]
}

const initialState: AppState = {
  isFetching: false,
  packages: [],
  errors: [],
  openPRs: [],
  openIssues: [],
  commits: [],
  packageUpdates: [],
  stats: [],
  isFetchingToken: false,
  isLoggedIn: false
}

export const reducer = reducerWithInitialState(initialState)
  .case(fetch, (state, payload) => ({
    ...state,
    isFetching: payload.isFetching
  }))
  .case(deleteError, (state, payload) => ({
    ...state,
    errors: state.errors.filter(error => error.id !== payload.id)
  }))
  .case(addPackage, (state, payload) => ({
    ...state,
    openPRs: state.openPRs
      .filter(openPR => openPR.packageName !== payload.package.packageName)
      .concat([
        {
          packageName: payload.package.packageName,
          data: payload.package.openPRs
        }
      ]),
    openIssues: state.openIssues
      .filter(
        openIssue => openIssue.packageName !== payload.package.packageName
      )
      .concat([
        {
          packageName: payload.package.packageName,
          data: payload.package.openIssues
        }
      ]),
    commits: state.commits
      .filter(commit => commit.packageName !== payload.package.packageName)
      .concat([
        {
          packageName: payload.package.packageName,
          data: payload.package.commits
        }
      ]),
    packageUpdates: state.packageUpdates
      .filter(
        packageUpdate =>
          packageUpdate.packageName !== payload.package.packageName
      )
      .concat([
        {
          packageName: payload.package.packageName,
          data: payload.package.packageUpdates
        }
      ]),
    packages: state.packages
      .filter(packageName => packageName !== payload.package.packageName)
      .concat([payload.package.packageName]),
    stats: state.stats
      .filter(stat => stat.packageName !== payload.package.packageName)
      .concat([
        {
          packageName: payload.package.packageName,
          lastCommit: payload.package.lastCommit,
          latestPackage: payload.package.latestPackage,
          maintainers: payload.package.maintainers
        }
      ])
  }))
  .case(deletePackage, (state, payload) => ({
    ...state,
    stats: state.stats.filter(stat => stat.packageName !== payload.packageName),
    packages: state.packages.filter(
      packageName => packageName !== payload.packageName
    ),
    openPRs: state.openPRs.filter(
      openPR => openPR.packageName !== payload.packageName
    ),
    openIssues: state.openIssues.filter(
      openIssue => openIssue.packageName !== payload.packageName
    ),
    commits: state.commits.filter(
      commit => commit.packageName !== payload.packageName
    ),
    packageUpdates: state.packageUpdates.filter(
      packageUpdate => packageUpdate.packageName !== payload.packageName
    )
  }))
  .case(addError, (state, payload) => ({
    ...state,
    errors: state.errors
      .filter(error => error.id !== payload.err.id)
      .concat([payload.err])
  }))
  .case(fetchToken, (state, payload) => ({
    ...state,
    isFetchingToken: payload.isFetchingToken
  }))
  .case(setLoggedIn, (state, payload) => ({
    ...state,
    isLoggedIn: payload.isLoggedIn
  }))
