import React from 'react';
import { Helmet } from 'react-helmet';

import Access from './Components/Access';
import Main from './Components/Main';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      accessToken: '',
      view: 'Login'
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.access = React.createRef();
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
        if(jsonResponse.status === 'OK'){
          this.setState({
            accessToken: jsonResponse.token,
            view: 'Main'
          })
          localStorage.accessToken = jsonResponse.token
        }
        else{
          this.access.current.message(jsonResponse.message, 'alert');
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  logout(){
    localStorage.removeItem('accessToken');
    this.setState({
      accessToken: '',
      view: 'Login'
    })
  }

  register(email, password){
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    fetch('http://localhost:3001/register', {
      method: 'post',
      headers: headers,
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => {
      response.json().then(jsonResponse => {
        if(jsonResponse.status === 'HTTP1.0 200 OK'){
          this.access.current.message('User successfully registered. Now you can log in.', 'informative');
          this.access.current.changeForm('login');
        }
        else{
          this.access.current.message(jsonResponse.message, 'alert');
        }
      })
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
    else{
      this.setState({
        view: 'Login'
      })
    }
  }

  render(){
    let view = () => {
      switch(this.state.view){
        case 'Login':
          return <Access ref={this.access} onLogin={this.login} onRegister={this.register}/>
        case 'Main':
          return <Main accessToken={this.state.accessToken} logout={this.logout}/>
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
