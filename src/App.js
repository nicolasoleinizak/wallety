import React from 'react';
import { Helmet } from 'react-helmet';

import Login from './Components/Login';
import Main from './Components/Main';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      accessToken: '',
      view: 'Login'
    }
    this.login = this.login.bind(this)
  }

  login(email, password){
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then((response) => {
      response.json().then((jsonResponse) => {
        if(response.status === 200){
          this.setState({
            accessToken: jsonResponse.token,
            view: 'Main'
          })
          localStorage.accessToken = jsonResponse.token
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  componentDidMount(){
    if(localStorage.accessToken){
      this.setState({
        accessToken: localStorage.accessToken
      }, () => {
        this.setState({
          view: 'Main'
        })
      })
    }
  }

  render(){
    let view = () => {
      switch(this.state.view){
        case 'Login':
          return <Login login={this.login}/>
        case 'Main':
          return <Main accessToken={this.state.accessToken}/>
      } 
    }

    return(
      <div id="app">
        <Helmet>
          <link href="./css/styles.css" rel="stylesheet" />
        </Helmet>
        {view()}
      </div>
    )
  }
}

export default App;
