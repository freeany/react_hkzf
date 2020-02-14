import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'

// import { Button } from 'antd-mobile'

class App extends Component {
  render() {
    return (
      <div className="app">
        <Router>
          <Route
            path="/"
            render={() => <Redirect to="/home"></Redirect>}
          ></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>
        </Router>
        {/* <div>
          <Button type="primary">按钮</Button>
        </div> */}
      </div>
    )
  }
}

export default App
