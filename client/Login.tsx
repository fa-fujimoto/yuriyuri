import React, { Component, FormEvent } from 'react'
import { Redirect } from 'react-router-dom'

interface ILoginProps {
  sessionId: string
  handleMessageChange: (message: string[]) => void
  handleMessageUpdate: (message: string) => void
  handleUserLogin: (username: string, sessionId: string) => void
}

interface ILoginState {
  username: string
  password: string
}

class Login extends Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLoginClick = this.handleLoginClick.bind(this)
  }

  handleUsernameChange(event: FormEvent<HTMLInputElement>): void {
    this.setState({
      username: event.currentTarget.value,
    })
  }

  handlePasswordChange(event: FormEvent<HTMLInputElement>): void {
    this.setState({
      password: event.currentTarget.value,
    })
  }

  handleLoginClick(): void {
    const {username, password} = this.state

    if (username.length === 0) {
      this.props.handleMessageUpdate('username empty')
    } else if (password.length === 0) {
      this.props.handleMessageUpdate('password empty')
    } else if (password !== '1118') {
      this.props.handleMessageUpdate('not matched password')
    } else {
      this.props.handleUserLogin(username, '1111')
    }
  }

  render(): JSX.Element {
    const {username, password} = this.state
    return (
      this.props.sessionId ? (
        <Redirect to={'/'} />
      ) : (
        <div>
          <h2>login form</h2>

          <div><input type="text" value={username} onChange={this.handleUsernameChange} placeholder='username'/></div>
          <div><input type="password" value={password} onChange={this.handlePasswordChange} placeholder='password'/></div>

          <div onClick={this.handleLoginClick}>Login</div>
        </div>
      )
    )
  }
}

export default Login