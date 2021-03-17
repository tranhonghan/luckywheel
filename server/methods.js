const AppConstants = require('../src/Constants/AppConstants')

const optionSelect = [
    {key: '1', value: 'cake', text: 'cake'},
    {key: '2', value: 'juice', text: 'juice'},
    {key: '3', value: 'fruit', text: 'fruit'}
  ]

const uuid = require('uuid/v4')

const isUser = ( users, nickname ) => nickname in users 

const createUser = ( nickname, socketId ) => ({ nickname, socketId })

const addUsers = ( users, user ) => {
    users[ user.nickname ] = user
    return users
}

const createChat = ({ name='Community', description='Public room' } = {}) => ({
    name,
    description,
    messages: [],
    msgCount: 0,
    typingUser: [],
    dataWheel: AppConstants.CAKE,
    typeWheel: AppConstants.OPTION_SELECT[0].value,
    resultWheel: null
})

const isChannel = ( channelName, chats ) => chats.includes( channelName )


const delUser = ( users, nickname ) => {
    delete users[ nickname ]
    return users   
}

const createMessage = ( message, sender ) => ({
    id: uuid(),
    time: new Date(Date.now()),
    message,
    sender
})

module.exports = {
    isUser,
    createUser,
    addUsers,
    createChat,
    delUser,
    createMessage,
    isChannel
}