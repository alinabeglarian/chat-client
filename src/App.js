import React, { Component } from 'react'
import * as request from 'superagent'
import { connect } from 'react-redux'
import { onEvent } from './actions/messages'

export class App extends Component {
  state = {
    message: ''
  }

  // url = 'https://gentle-brook-30095.herokuapp.com'
  url = 'http://localhost:5000'
  
  // connect to server EventStream
  source = new EventSource(`${this.url}/stream`)

  // connect the source to the handler 
  componentDidMount() {
    this.source.onmessage = this.props.onEvent
  }

  onChange = (event) => {
    const { value } = event.target
    this.setState({ message: value })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.setState({ message: '' })
    request
      .post(`${this.url}/message`)
      .send({ message: this.state.message })
      .then(res => {
        console.log('response test:', res)
      })
      .catch(console.error)
  }

  render() {
    const messages = this
      .props
      .messages
      .map((message, index) => <p
        key={index}
      >
        {message.message}
      </p>)

    return <main>
      <form onSubmit={this.onSubmit}>
        <input 
          onChange={this.onChange} 
          type='text'
          value={this.state.message}
        />
        <button>send</button>
      </form>

      {messages}
    </main>
  }
}

function mapStateToProps (state) {
  return {
    messages: state.messages
  }
}

const mapDispatchToProps = { onEvent }

export default connect(
  mapStateToProps, 
  mapDispatchToProps
  )(App)
