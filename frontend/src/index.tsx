/**
 * Author of this code work, Yuki Mogi. c FFRI, Inc. 2019
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import rootSaga from './sagas'
import Search from './containers/Search'
import Table from './containers/Table'
import Chip from './containers/Chip'
import Error from './containers/Error'
import Graph from './containers/Graph'
import { reducer } from './modules'
import { composeWithDevTools } from 'redux-devtools-extension'
import Grid from '@material-ui/core/Grid'
import Login from './containers/Login'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {
  connectRouter,
  routerMiddleware,
  ConnectedRouter
} from 'connected-react-router'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  combineReducers({
    reducer,
    router: connectRouter(history)
  }),
  composeWithDevTools(
    applyMiddleware(sagaMiddleware, routerMiddleware(history))
  )
)
sagaMiddleware.run(rootSaga)

const Home = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Grid container justify="center">
        <Search />
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Grid container justify="center">
        <Error />
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Grid container justify="center">
        <Chip />
      </Grid>
    </Grid>
    <Graph />
    <Grid item xs={12}>
      <Table />
    </Grid>
    <Grid item xs={12}>
      <Login />
    </Grid>
  </Grid>
)

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </ConnectedRouter>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('app'))
