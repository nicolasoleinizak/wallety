import React from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.login = this.login.bind(this)
    }

    handleInputChange(event){
        let name = event.target.name
        let value = event.target.value
        this.setState((prevState) => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    login(){
        this.props.onLogin(this.state.email, this.state.password)
    }

    render(){
        return(
            <div id="login">
                <form>
                    <input type="email" name="email" value={this.state.emailInput} onChange={this.handleInputChange} placeholder="Enter your email"/>
                    <input type="password" name="password" value={this.state.emailInput} onChange={this.handleInputChange} placeholder="Enter your password"/>
                    <input type="button" onClick={this.login} value="Login" />
                </form>
            </div>
        )
    }
}

export default Login