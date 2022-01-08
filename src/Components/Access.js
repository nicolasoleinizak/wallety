import React from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            passwordCheck: '',
            accessDisplay: 'login',
            message: {
                text: '',
                type: 'null'
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleRadioChange = this.handleRadioChange.bind(this)
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
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
        this.setState({
            message: {
                text: '',
                type: 'none'
            }
        })
    }

    register(){
        this.props.onRegister(this.state.email, this.state.password)
        this.setState({
            message: {
                text: '',
                type: 'none'
            }
        })
    }

    handleRadioChange(event){
        this.setState({
            accessDisplay: event.target.value,
            message: {
                text: '',
                type: 'none'
            },
            email: '',
            password: ''
        })
    }

    message(text, type){
        this.setState({
            message: {
                text: text,
                type: type
            }
        })
    }

    changeForm(formName){
        this.setState({
            accessDisplay: formName
        })
    }

    render(){
        return(
            <div id="access">
                <form id="access-container">
                    <div className="radio-group">
                        <label className={this.state.accessDisplay === 'login'? 'checked-label': ''}><input type="radio" name="accessDisplay" value="login" onChange={this.handleRadioChange} checked={this.state.accessDisplay === 'login'}/>Login</label>
                        <label className={this.state.accessDisplay === 'register'? 'checked-label': ''}><input type="radio" name="accessDisplay" value="register" onChange={this.handleRadioChange} checked={this.state.accessDisplay === 'register'}/>Register</label>
                    </div>
                    { this.state.accessDisplay === 'login' &&
                        <>
                            <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Email"/>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="Password"/>
                            <input type="button" onClick={this.login} value="Login" />
                        </>
                    }
                    { this.state.accessDisplay === 'register' &&
                        <>
                            <input type="email" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Enter your email"/>
                            <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="Enter your password"/>
                            <input type="password" name="passwordCheck" value={this.state.passwordCheck} onChange={this.handleInputChange} placeholder="Enter your password again"/>
                            <span>{this.state.password != this.state.passwordCheck? 'The passwords doesn\'t match' : ''}</span>
                            <input type="button" onClick={this.register} value="Register" />
                        </>
                    }
                    <div className={`message-box message-${this.state.message.type}`}>{this.state.message.text}</div>
                </form>
            </div>
        )
    }
}

export default Login