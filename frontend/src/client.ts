/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import Axios, { AxiosInstance, AxiosResponse, CancelToken } from 'axios'
import { backendUrl } from './utils/config'

const baseURL = backendUrl

const instance: AxiosInstance = Axios.create({
  baseURL,
  timeout: 100000
})

export const fetchNpmInfo = (
  packageName: string,
  cancelToken: CancelToken = null
): Promise<AxiosResponse> =>
  instance.get(`/npm/${packageName}`, {
    cancelToken
  })

export const fetchRepoInfo = (
  user: string,
  repo: string,
  maxLimit: number,
  cancelToken: CancelToken = null
): Promise<AxiosResponse> =>
  instance.get(`/github/${user}/${repo}?max_limit=${maxLimit}`, {
    cancelToken,
    withCredentials: true
  })

export const fetchGithubToken = (
  clientId: string,
  code: string,
  cancelToken: CancelToken = null
): Promise<AxiosResponse> =>
  instance.get(`/github/auth?client_id=${clientId}&code=${code}`, {
    cancelToken,
    withCredentials: true
  })

export const deleteGithubToken = (
  clientId: string,
  cancelToken: CancelToken = null
): Promise<AxiosResponse> =>
  instance.delete(`/github/auth?client_id=${clientId}`, {
    cancelToken,
    withCredentials: true
  })
