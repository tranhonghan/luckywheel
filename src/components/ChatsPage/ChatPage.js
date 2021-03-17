import React, { Component } from 'react'
import events from '../../events'
import AppConstants from '../Constants/AppConstants'
import { Grid } from 'semantic-ui-react'
import Sidebar from './Sidebar';
import MessageHeader from './MessageHeader'
import MessagesBody from './MessagesBody'
import MessageInput from './MessageInput'
import Wheel from '../wheel';
import { Dropdown } from 'semantic-ui-react'

const optionSelect = [
  {key: '1', value: 'cake', text: 'cake'},
  {key: '2', value: 'juice', text: 'juice'},
  {key: '3', value: 'fruit', text: 'fruit'}
]

export class ChatPage extends Component {

  constructor() {
    super()
  }

  state = {
    chats: [],
    activeChannel: null,
    dataWheel: AppConstants.CAKE,
    typeWheel: optionSelect[0].value,
    resultWheel: null
  }

  componentDidMount(){
    let { socket } = this.props
    socket.emit(events.INIT_CHATS, this.initChats )
    socket.on( events.MESSAGE_SEND, this.addMessage )
    socket.on( events.TYPING, this.addTyping )
    socket.on( events.P_MESSAGE_SEND, this.addPMessage )
    socket.on( events.P_TYPING, this.addPTyping)
    socket.on( events.CREATE_CHANNEL, this.updateChats )
    socket.on( events.TYPE_WHEEL, this.updateTypeWheel )
    socket.on( events.RESULT_WHEEL, this.updateResultWheel )
  }

  initChats =  _chats  => this.updateChats( _chats, true )
  
  updateChats = ( _chats, init=false ) => {
    let { chats } = this.state
    let newChats = init ? [ ..._chats ] : [ ...chats, _chats ]
    this.setState({ chats: newChats, activeChannel: init ? _chats[0] : this.state.activeChannel })
  }

  addTyping = ({ channel, isTyping, sender }) => {
    let { user } = this.props
    let { chats } = this.state
    if( sender === user.nickname ) return
    chats.map( chat => {
      if( chat.name === channel ){
        if( isTyping && !chat.typingUser.includes( sender )){
          chat.typingUser.push( sender )
        } else if( !isTyping && chat.typingUser.includes( sender )){
          chat.typingUser = chat.typingUser.filter( u => u !== sender )
        }
      }
      return null
    })
    this.setState({ chats })
  }

  addPTyping = ({ channel, isTyping }) => {
    console.log( channel, isTyping )
    let { pChats } = this.props
    pChats.map( pChat => {
      if( pChat.name === channel ){
        pChat.isTyping = isTyping
      }
      return null
    })
    this.setState({ pChats })
  }

  addMessage = ({ channel, message }) => {
    let { activeChannel, chats } = this.state

    chats.map( chat => {
      if( chat.name === channel ) {
        chat.messages.push( message )
        if ( activeChannel.name !== channel ) chat.msgCount ++
      }
      return null
    })
    this.setState({ chats })
  }

  addPMessage = ({ channel, message }) => {
    let { activeChannel } = this.state
    let { pChats } = this.props

    pChats.map( pChat => {
      if( pChat.name === channel ) {
        pChat.messages.push( message )
        if( activeChannel.name !== channel ) pChat.msgCount ++
      }
      return null
    })
    this.setState({ pChats })
  }

  sendMsg = msg => {
    let { socket, users  } = this.props
    let { activeChannel } = this.state
    if( activeChannel.type ) {
      let receiver = users[ activeChannel.name ]
      socket.emit( events.P_MESSAGE_SEND, { receiver, msg })
    } else {
      socket.emit( events.MESSAGE_SEND, { channel: activeChannel.name, msg })
    }

  }

  sendTyping = isTyping => {
    let { socket, users } = this.props
    let { activeChannel } = this.state
    if( activeChannel.type ){
      let receiver = users[ activeChannel.name ]
      socket.emit( events.P_TYPING, { receiver: receiver.socketId, isTyping })
    }
    socket.emit( events.TYPING, { channel: activeChannel.name, isTyping })
  }

  setActiveChannel = name => {
    let newActive = this.state.chats.filter( chat => chat.name === name )
    newActive[0].msgCount = 0
    this.setState({ activeChannel: newActive[0] })
  }

  setActivePChannel = name => {
    let newActive = this.props.pChats.filter( pChat => pChat.name === name )
    newActive[0].msgCount = 0
    this.setState({ activeChannel: newActive[0] })
  }

  updateTypeWheel = ({ channel, data }) => {
    let { activeChannel, chats } = this.state

    chats.map( chat => {
      if ( chat.name === channel ) {
        chat.typeWheel = data.value
        chat.dataWheel = this.getDataWheel(data.value)
      }
      return null
    })
    // this.setState({chats, typeWheel: data.value, dataWheel: this.getDataWheel(data.value)})
    this.setState({chats})
  }

  updateResultWheel = ({ channel, data }) => {
    let { activeChannel, chats } = this.state

    chats.map( chat => {
      if ( chat.name === channel ) {
        chat.resultWheel = data.value
      }
      return null
    })

    setTimeout(() => {
      this.setState(chats)
    }, 4000);
  }

  onChangeSelect = (e, data) => {
    let { socket, users } = this.props
    let { activeChannel } = this.state

    this.setState({dataWheel: this.getDataWheel(data.value)})
    if ( activeChannel.type ) {
      let  receiver = users[ activeChannel.name ]
      socket.emit( events.P_TYPE_WHEEL, { receiver, data })
    } else {
      socket.emit( events.TYPE_WHEEL, { channel: activeChannel.name, data})
    }

  }

  onSelectItemWheel = data => {
    let { socket, users } = this.props
    let { activeChannel } = this.state

    if ( activeChannel.type ) {
      let receiver = users[ activeChannel.name ]
      socket.emit( events.P_RESULT_WHEEL, { receiver, data })
    } else {
      socket.emit( events.RESULT_WHEEL, {channel: activeChannel.name, data })
    }
  }

  getDataWheel = (typeWheel) => {
    if (typeWheel === 'cake') {
      return AppConstants.CAKE
    } else if (typeWheel === 'fruit') {
      return AppConstants.FRUIT
    } else if (typeWheel === 'juice') {
      return AppConstants.JUICE
    }
  } 
 
  render() {
    let { user, users, pChats, logout, socket } = this.props
    let { activeChannel, chats, dataWheel, typeWheel} = this.state
    return (
      <Grid style={{ height: '100vh', margin: '0px'}}>
        <Grid.Column computer={12} tablet={ 12 } mobile={10} style={{ background: '#eee', height: '100%'}}>
        {
          activeChannel && (
            <React.Fragment>
              <MessageHeader activeChannel= { activeChannel } /> 
              {/* <MessagesBody 
                messages = { activeChannel.messages } 
                user={ user } 
                typingUser = { activeChannel.typingUser } />
              <MessageInput 
                sendMsg = { this.sendMsg } 
                sendTyping = { this.sendTyping } />   */}
              <div>
                <h1>Type lucky wheel</h1>
                <Dropdown 
                  search 
                  selection 
                  options={optionSelect}
                  onChange={this.onChangeSelect}
                  value={activeChannel.typeWheel}
                />
                <Wheel 
                  items={activeChannel.dataWheel}
                  onSelectItem={this.onSelectItemWheel}
                />
              </div>
              <div style={{justifyContent: 'center', alignItems: 'center'}}>
                <h1 style={{textAlign: 'center'}}>Ket Qua: {activeChannel.resultWheel}</h1>
              </div>
            </React.Fragment>
          ) 
        }
        </Grid.Column>
        <Grid.Column computer={4} tablet={ 4 } mobile={6} style={{ background: '#4c3c4c', height: '100%'}}>
          <Sidebar
            user = { user }
            users = { users }
            chats = { chats }
            socket = { socket }
            activeChannel = { activeChannel }
            logout = { logout }
            setActivePChannel = { this.setActivePChannel }
            setActiveChannel = { this.setActiveChannel }
            pChats = { pChats }
          />
        </Grid.Column>
      </Grid>   
    )
  }
}

export default ChatPage
