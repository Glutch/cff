import React, { Component } from 'react'
import io from 'socket.io-client'
import fetch from 'isomorphic-fetch'

class HomePage extends Component {
  state = {
    buttonText: 'Add character',
    visible: true,
    character: '',
    guild: '',
    server: '',
    region: '',
    characters: []
  }

  componentDidMount() {
    // document.body.style.background = '#ececec'
    document.body.style.fontFamily = 'sans-serif'
    this.socket = io()
    this.socket.on('newCharacter', this.newCharacter)
    this.socket.on('characters', this.getAllCharacters)
  }

  componentWillUnmount() {
    this.socket.off('character', this.newCharacter)
    this.socket.close()
  }

  newCharacter = character => {
    this.setState(state => ({ characters: state.characters.concat(character) }))
  }

  getAllCharacters = characters => {
    this.setState(state => ({ characters }))
  }

  createCharacter = evt => {
    evt.preventDefault()

    const { character, guild, server, region } = this.state

    const toon = {
      character,
      guild,
      server,
      region,
      timestamp: new Date(),
    }

    if (toon.character && toon.server && toon.region) {
      this.socket.emit('newCharacter', toon)
      this.setState(state => ({
        visible: false,
        characters: state.characters.concat(toon)
      }))
    } else {
      this.setState({ buttonText: 'Fill all inputs (retry)'})
    }
  }

  render() {

    const { character, guild, server, region, characters, visible, buttonText } = this.state
    const { createCharacter} = this
    const formStyle = {
      display: visible ? 'flex' : 'none',
      flexWrap: 'wrap',
      width: '50%',
      padding: 50,
      margin: 'auto'
    }
    const inputStyle = {
      flex: '1 1 0',
      padding: 20,
      background: '#fff',
      fontSize: 16,
      boxSizing: 'border-box',
      border: '1px solid #ececec',
      outline: 'none',
      borderRadius: 0,
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none'
    }
    const buttonStyle = {
      ...inputStyle,
      flex: '0 0 100%',
      cursor: 'pointer'
    }
    const rowStyle = {
      flex: '1 1 0',
      padding: 20,
      margin: 1,
      background: '#fff'
    }

    return (
      <main>

        <form style={formStyle} onSubmit={createCharacter}>
          <input
            style={inputStyle}
            onChange={evt => this.setState({ character: evt.target.value })}
            placeholder="Character"
            value={character}
          />
          <input
            style={inputStyle}
            onChange={evt => this.setState({ guild: evt.target.value })}
            placeholder="Guild"
            value={guild}
          />
          <input
            style={inputStyle}
            onChange={evt => this.setState({ server: evt.target.value })}
            placeholder="Server"
            value={server}
          />
          <select
            style={inputStyle}
            onChange={evt => this.setState({ region: evt.target.value })}
            value={region}
          >
            <option value="false">Select region</option>
            <option value="Americas">Americas</option>
            <option value="Europe">Europe</option>
            <option value="China">China</option>
            <option value="Korea">Korea</option>
          </select>
          <button style={buttonStyle}>{buttonText}</button>
        </form>

        <div>
          {characters.map(item =>
            <div key={item.id} style={{display: 'flex'}}>
              <div style={rowStyle}>{item.character}</div>
              <div style={rowStyle}>{item.guild}</div>
              <div style={rowStyle}>{item.server}</div>
              <div style={rowStyle}>{item.region}</div>
            </div>
          )}
        </div>

      </main>
    )
  }
}

export default HomePage
