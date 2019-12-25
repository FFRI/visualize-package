/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import { PackageIssueData, PackageUpdateData } from '../modules'
// The blow code makes a error which says "Moment is not a function"
// import * as Moment from 'moment'
// So the below code is a workaround
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment as any)

// for commits and updates
export const makeGraphDataFromStrings = (dataList: PackageUpdateData[]) => {
  const dateData = dataList.map(({ packageName, data }) => ({
    packageName,
    data: data
      .map(date => new Date(date))
      .map(date => new Date(`${date.getFullYear()}/${date.getMonth() + 1}`))
  }))
  const allDate = dateData
    .map(({ data }) => data)
    .reduce((acc, val) => acc.concat(val), [])
    .map(d => d.getTime())
  const lowerDate = new Date(Math.min(...allDate))
  const upperDate = new Date(Math.max(...allDate))
  const range = moment.range(moment(lowerDate), moment(upperDate))
  const duration = Array.from(range.by('month'))
  const packageDataForGraph = dateData.map(({ packageName, data }) => ({
    packageName,
    data: duration.map(
      d =>
        data.filter(packageDate =>
          moment.range(moment(d), moment(d)).contains(packageDate)
        ).length
    )
  }))
  const titles = ['x'].concat(
    packageDataForGraph.map(({ packageName }) => packageName)
  )
  const items = [titles].concat(
    duration.map((v, i) =>
      [
        new Date(Number(v.format('YYYY')), Number(v.format('MM')) - 1) as any
      ].concat(packageDataForGraph.map(({ data }) => data[i] as any))
    )
  )
  return items
}

// for pulls and issues
export const makeGraphDataFromObjects = (data: PackageIssueData[]) => {
  const MAX_TIMESTAMP = 8640000000000000
  const dateData = data
    .map(({ packageName, data }) => ({
      packageName,
      data: data.map(({ createdAt, closedAt }) => ({
        createdAt: new Date(createdAt),
        closedAt:
          closedAt === null ? new Date(MAX_TIMESTAMP) : new Date(closedAt)
      }))
    }))
    .map(({ packageName, data }) => ({
      packageName,
      data: data.map(({ createdAt, closedAt }) => ({
        createdAt: new Date(
          `${createdAt.getFullYear()}/${createdAt.getMonth() + 1}`
        ),
        closedAt: new Date(
          `${closedAt.getFullYear()}/${closedAt.getMonth() + 1}`
        )
      }))
    }))
  const allCreatedAt = dateData
    .map(({ data }) => data.map(({ createdAt }) => createdAt))
    .reduce((acc, val) => acc.concat(val), [])
    .map(d => d.getTime())
  const allClosedAt = dateData
    .map(({ data }) =>
      data
        .map(({ closedAt }) => closedAt)
        .filter(
          closedAt =>
            closedAt.getFullYear() !== new Date(MAX_TIMESTAMP).getFullYear()
        )
    )
    .reduce((acc, val) => acc.concat(val), [])
    .map(d => d.getTime())
  const allRange = allCreatedAt.concat(allClosedAt)
  const lowerDate = new Date(Math.min(...allCreatedAt))
  const upperDate = new Date(Math.max(...allRange))
  const range = moment.range(moment(lowerDate), moment(upperDate))
  const duration = Array.from(range.by('month'))
  const packageDataForGraph = dateData.map(({ packageName, data }) => ({
    packageName,
    data: duration.map(
      d =>
        data.filter(({ createdAt, closedAt }) =>
          moment.range(moment(createdAt), moment(closedAt)).contains(d)
        ).length
    )
  }))
  const titles = ['x'].concat(
    packageDataForGraph.map(({ packageName }) => packageName)
  )
  const items = [titles].concat(
    duration.map((v, i) =>
      [
        new Date(Number(v.format('YYYY')), Number(v.format('MM')) - 1) as any
      ].concat(packageDataForGraph.map(({ data }) => data[i] as any))
    )
  )

  return items
}
