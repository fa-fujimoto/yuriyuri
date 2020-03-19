import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

interface IAuthProps {
  isAuth: boolean
  handleAuthChange: (isAuth: boolean) => void
}

class Auth extends Component<IAuthProps> {
  constructor(props: IAuthProps) {
    super(props)
  }

  render(): JSX.Element {
    return (
      this.props.isAuth ? (
        <Route children={this.props.children} />
      ) : (
        <Redirect to={'/login'} />
      )
    )
  }
}

export default Auth