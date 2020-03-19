import React, { Component } from 'react'
import {Route, BrowserRouter, Switch} from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faBan, faExchangeAlt, faMagnet, faFire, faLock, faStarOfDavid, faStarAndCrescent, faAddressCard, faLeaf, faLowVision, faPlusCircle, faMinusCircle, faHeart, faPrayingHands } from '@fortawesome/free-solid-svg-icons'

import Auth from './Auth'
import Login from './Login'
import RoomRouter from './RoomRouter'
import ViewTest from './ViewTest'

library.add(
  faPlusCircle,
  faMinusCircle,
  faHeart,
  faPrayingHands,
  faCheck,
  faBan,
  faExchangeAlt,
  faMagnet,
  faFire,
  faStarOfDavid,
  faStarAndCrescent,
  faLock,
  faAddressCard,
  faLeaf,
  faLowVision,
)

interface IAppState {
  username: string
  sessionId: string
  isAuth: boolean
  message: string[]
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props)

    const sessionId = localStorage.getItem('YURIKURE_SESSION_ID') || ''
    const username = localStorage.getItem('YURIKURE_USERNAME') || ''

    this.state = {
      username,
      sessionId,
      isAuth: sessionId !== '',
      message: [],
    }

    this.handleUserLogin = this.handleUserLogin.bind(this)
    this.handleUserLogout = this.handleUserLogout.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handleSessionIdChange = this.handleSessionIdChange.bind(this)
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this)
    this.handleAuthChange = this.handleAuthChange.bind(this)
  }


  componentDidUpdate(): void {
    this.userWillTranfer()
  }

  userWillTranfer(): void {
    const sessionId = localStorage.getItem('YURIKURE_SESSION_ID')
    const existSessionId = sessionId !== null && sessionId.length > 0
    if (!existSessionId && this.state.isAuth) {
      this.handleAuthChange(false)
    } else if (existSessionId && !this.state.isAuth) {
      this.handleAuthChange(true)
    }
  }

  handleUserLogin(username: string, sessionId: string): void {
    this.setState({
      username,
      sessionId,
      message: [],
    })

    localStorage.setItem('YURIKURE_USERNAME', username)
    localStorage.setItem('YURIKURE_SESSION_ID', sessionId)
  }

  handleUserLogout(): void {
    this.setState({
      username: '',
      sessionId: '',
      message: [],
    })

    localStorage.removeItem('YURIKURE_USERNAME')
    localStorage.removeItem('YURIKURE_SESSION_ID')
  }

  handleUsernameChange(username: string): void {
    this.setState({ username })
    localStorage.setItem('YURIKURE_USERNAME', username)
  }

  handleSessionIdChange(sessionId: string): void {
    this.setState({ sessionId })
    localStorage.setItem('YURIKURE_SESSION_ID', sessionId)
  }

  handleMessageChange(message: string[]): void {
    this.setState({ message })
  }

  handleMessageUpdate(message: string): void {
    this.setState({
      message: this.state.message.concat(message),
    })
  }

  handleAuthChange(auth: boolean): void {
    this.setState({
      isAuth: auth,
    })
  }

  render(): JSX.Element {
    const {state, handleMessageChange, handleMessageUpdate, handleAuthChange, handleUserLogin, handleUserLogout} = this
    const {username, sessionId, isAuth} = state
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/test' component={ViewTest} />
          <Route path='/login' render={
            (): JSX.Element =>
              <Login
                sessionId={sessionId}
                handleMessageChange={handleMessageChange}
                handleMessageUpdate={handleMessageUpdate}
                handleUserLogin={handleUserLogin}
              />}
          />
          <Auth isAuth={isAuth} handleAuthChange={handleAuthChange}>
            <RoomRouter username={username} />
            <div onClick={handleUserLogout}>logout</div>
          </Auth>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App