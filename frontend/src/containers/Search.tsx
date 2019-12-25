/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import SearchComponent from '../components/Search'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../modules'

type SearchState = {
  packageName: string
}

const isFetchingSelector = (state: State) => state.reducer.isFetching
const isLoggedInSelector = (state: State) => state.reducer.isLoggedIn

const SearchContainer = () => {
  const [state, setState] = React.useState<SearchState>({ packageName: '' })
  const isFetching = useSelector(isFetchingSelector)
  const isLoggedIn = useSelector(isLoggedInSelector)
  const dispatch = useDispatch()
  const fetchPackageSaga = {
    type: 'FETCH_PACKAGE_SAGA',
    payload: {
      packageName: state.packageName,
      isLoggedIn: isLoggedIn
    }
  }
  return (
    <SearchComponent
      onClick={() => state.packageName && dispatch(fetchPackageSaga)}
      onKeyDown={(
        e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => e.key === 'Enter' && state.packageName && dispatch(fetchPackageSaga)}
      onChange={(e: React.ChangeEvent<any>) => {
        setState({ packageName: e.target.value.toLowerCase() })
      }}
      isFetching={isFetching}
    />
  )
}

export default SearchContainer
