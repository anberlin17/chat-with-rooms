import express from 'express'
import cors from 'cors'
import http from 'http'
import chalk from 'chalk'
import { Server } from 'socket.io'
import { Message, UserInfo } from './types'
import { connectToDatabase } from './mongodb'
import { MessageModel } from './models/message-model'
import { SocketAction } from './const'

connectToDatabase()

const port = 3000
const CHAT_BOT = 'ChatBot'

let allUsers: UserInfo[] = []
let chatRoom = ''

const app = express()
  .use(cors())
  .get('/', (req, res) => {
    console.debug('GET /')
    res.sendStatus(200)
  })

const server = http.createServer(app)
server.listen(port, () => {
  console.log(chalk.blue(`listening on *:${port}`))
})

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

io.on('connection', socket => {
  console.log(chalk.blue(`user connected:`), socket.id)

  socket.on(SocketAction.JoinRoom, data => {
    console.log(chalk.blue(SocketAction.JoinRoom), JSON.stringify(data))
    const { username, room } = data
    socket.join(room)

    chatRoom = room
    allUsers.push({ id: socket.id, username, room })
    const chatRoomUsers = allUsers.filter(user => user.room === room)

    let date = Date.now()
    socket.to(room).emit(SocketAction.ChatroomUsers, chatRoomUsers)
    socket.to(room).emit(SocketAction.NewMessage, {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      date
    })

    socket.emit(SocketAction.ChatroomUsers, chatRoomUsers)

    MessageModel.find({ room: chatRoom })
      .limit(100)
      .then(messages => {
        console.log(`sending chat history to ${username} in room ${room}`)
        socket.emit(SocketAction.History, messages)
        socket.emit(SocketAction.NewMessage, {
          message: `Welcome ${username}`,
          username: CHAT_BOT,
          date
        })
      })
      .catch(err => console.error(chalk.red(`error sending chat history to`), username, err))
  })

  socket.on(SocketAction.NewMessage, (data: Message) => {
    console.log(chalk.blue(SocketAction.NewMessage, JSON.stringify(data)))
    const { message, username, room } = data

    const messageDoc = new MessageModel({ message, username, room })

    io.in(room).emit(SocketAction.NewMessage, {
      ...data,
      date: messageDoc.get('date', Date)
    })

    messageDoc
      .save()
      .then(doc => {
        console.log(chalk.green('message saved to database', doc))
      })
      .catch(err => {
        console.error(chalk.red('error saving message to database', err))
      })
  })

  socket.on(SocketAction.LeaveRoom, (data: UserInfo) => {
    const { username, room } = data
    console.log(username, chalk.blue('has left the chat'), JSON.stringify(data))
    socket.leave(room)
    allUsers = allUsers.filter(user => user.id !== socket.id)
    const chatRoomUsers = allUsers.filter(user => user.room === room)
    socket.to(room).emit(SocketAction.ChatroomUsers, chatRoomUsers)
    socket.to(room).emit(SocketAction.NewMessage, {
      message: `${username} has left the chat`,
      username: CHAT_BOT,
      date: Date.now()
    })
  })

  socket.on(SocketAction.Disconnect, () => {
    console.log(chalk.blue('user disconnected'))
    const user = allUsers.find(user => user.id == socket.id)
    if (user?.username) {
      allUsers = allUsers.filter(user => user.id !== socket.id)
      socket.to(chatRoom).emit(SocketAction.ChatroomUsers, allUsers)
      socket.to(chatRoom).emit(SocketAction.NewMessage, {
        message: `${user.username} has disconnected from the chat.`,
        username: CHAT_BOT,
        date: Date.now()
      })
    }
  })
})
