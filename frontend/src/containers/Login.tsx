/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import LoginButton from '../components/Login'
import LogoutButton from '../components/Logout'
import { clientId } from '../utils/config'
import { useSelector, useDispatch } from 'react-redux'
import { addError, State, setLoggedIn } from '../modules'
import { push } from 'connected-react-router'
import useSessionstorage from '@rooks/use-sessionstorage'
import useCookie from 'react-use-cookie'

const genState = () =>
  Array.from(window.crypto.getRandomValues(new Uint32Array(40)), num =>
    num.toString(16)
  ).join('') as any

const isLoggedInSelector = (state: State) => state.reducer.isLoggedIn

const Login = () => {
  const isLoggedIn = useSelector(isLoggedInSelector)
  const dispatch = useDispatch()
  const [state, setState] = useSessionstorage('state', genState())
  const [userID] = useCookie('user_id', '')
  React.useEffect(() => {
    if (!isLoggedIn && userID && clientId) {
      dispatch(
        setLoggedIn({
          isLoggedIn: true
        })
      )
    }
    // eslint-disable-next-line
  }, [dispatch, userID])
  const onClick = () => {
    setState(genState())
    dispatch({
      type: 'DELETE_TOKEN_SAGA',
      payload: {
        clientId
      }
    })
  }
  const query = window.location.search.substring(1)
  const requestToken = query.split('code=')
  if (requestToken.length !== 1 && !isLoggedIn) {
    const requestTokenWithoutState = requestToken[1].split('&state=')
    const code = requestTokenWithoutState[0]
    const returnedState = requestTokenWithoutState[1]
    dispatch(push('/'))
    if (returnedState !== state) {
      setState(genState())
      dispatch(
        addError({
          err: {
            id: 'GitHub OAuth',
            msg:
              'GitHub OAuth failed because the state parameter is incorrect. Close the session or restart the app.'
          }
        })
      )
    } else {
      dispatch({
        type: 'FETCH_TOKEN_SAGA',
        payload: {
          clientId,
          code
        }
      })
    }
  }
  return (
    <>
      {!isLoggedIn ? (
        <LoginButton state={state} />
      ) : (
        <LogoutButton onClick={onClick} />
      )}
    </>
  )
}

export default Login
