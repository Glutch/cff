import { Component } from 'react'
import io from 'socket.io-client'
import fetch from 'isomorphic-fetch'

class HomePage extends Component {
  state = {
    message: '',
    messages: [],
  }

  componentDidMount() {
    this.socket = io()
    this.socket.on('message', this.newMessage)
    this.socket.on('messages', this.getAllMessages)
  }

  componentWillUnmount() {
    this.socket.off('message', this.newMessage)
    this.socket.close()
  }

  newMessage = message => {
    this.setState(state => ({ messages: state.messages.concat(message) }))
  }

  getAllMessages = messages => {
    this.setState(state => ({ messages }))
  }

  sendMessage = evt => {
    evt.preventDefault()

    const message = {
      id: new Date().getTime(),
      value: this.state.message,
    }

    this.socket.emit('message', message)

    this.setState(state => ({
      message: '',
      messages: state.messages.concat(message)
    }))
  }

  render() {
    return (
      <main>
        <div>
          <ul>
            {this.state.messages.map(message =>
              <li key={message.id}>{message.value}</li>
            )}
          </ul>
          <form onSubmit={this.sendMessage}>
            <input
              onChange={evt => this.setState({ message: evt.target.value })}
              type="text"
              placeholder="Hello world!"
              value={this.state.message}
            />
            <button>Send</button>
          </form>
        </div>
      </main>
    )
  }
}

export default HomePage
