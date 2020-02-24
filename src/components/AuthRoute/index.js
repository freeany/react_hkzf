import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLogin } from '../../utils'

const AuthRoute = ({ component: Component, ...reset }) => {
  return (
    <Route
      {...reset}
      render={props => {
        if (isLogin()) {
          return <Component {...props}></Component>
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: props.location.pathname
              }}
            ></Redirect>
          )
        }
      }}
    ></Route>
  )
}
export default AuthRoute
