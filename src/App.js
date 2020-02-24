import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import Profile from './pages/Profile'
import Detail from './pages/HouseDetail'
import Login from './pages/Login'
import Rent from './pages/Rent'
import AuthRoute from './components/AuthRoute'

// import { Button } from 'antd-mobile'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Router>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/home"></Redirect>}
          ></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>
          <Route path="/map" component={Map}></Route>
          <Route path="/detail/:id" component={Detail}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/profile" component={Profile}></Route>
          <AuthRoute path="/rent" component={Rent}></AuthRoute>
        </Router>
        {/* <div>
          <Button type="primary">按钮</Button>
        </div> */}
      </div>
    )
  }
}

export default App
