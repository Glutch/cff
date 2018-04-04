import React, { Component } from 'react'
import Body from '../components/body'
import io from 'socket.io-client'
import fetch from 'isomorphic-fetch'

const style = {
  form: {
    flexWrap: 'wrap',
    width: '50%',
    padding: 50,
    margin: 'auto'
  },
  input: {
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
  },
  button: {
    flex: '0 0 100%',
    cursor: 'pointer'
  },
  row: {
    flex: '1 1 0',
    padding: 20,
    margin: 1,
    background: '#fff'
  }
}

const CustomInput = ({ name, value } = props) =>
  <input
    style={style.input}
    onChange={evt => this.setState({ [name]: evt.target.value })}
    placeholder={name.toUpperCase()}
    value={value}
  />

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
    this.socket = io()
    this.socket.on('newCharacter', this.newCharacter)
    this.socket.on('characters', this.getAllCharacters)
  }

  newCharacter = character => {
    this.setState(state => ({ characters: state.characters.concat(character) }))
  }

  getAllCharacters = characters => {
    this.setState({ characters })
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

    return (
      <main>

        <form style={{ ...style.form, display: visible ? 'flex' : 'none' }} onSubmit={createCharacter}>
          <CustomInput name={"character"} value={character} />
          <CustomInput name={"guild"} value={guild} />
          <CustomInput name={"server"} value={server} />
          <select
            style={style.input}
            onChange={evt => this.setState({ region: evt.target.value })}
            value={region}
          >
            <option value="false">Select region</option>
            <option value="Americas">Americas</option>
            <option value="Europe">Europe</option>
            <option value="China">China</option>
            <option value="Korea">Korea</option>
          </select>
          <button style={{ ...style.button, ...style.input }}>{buttonText}</button>
        </form>

        <div>
          {characters.map(item =>
            <div key={item.id} style={{display: 'flex'}}>
              <div style={style.row}>{item.character}</div>
              <div style={style.row}>{item.guild}</div>
              <div style={style.row}>{item.server}</div>
              <div style={style.row}>{item.region}</div>
            </div>
          )}
        </div>

      </main>
    )
  }
}

export default HomePage
