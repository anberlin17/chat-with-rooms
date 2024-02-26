import { Socket } from 'socket.io-client'
import MessagesReceived from './messages'
import styles from './styles.module.css'
import SendMessage from './send-message'
import RoomAndUsers from './room-and-users'

export interface ChatProps {
  socket: Socket
  username: string
  room: string
}

export default function Chat({ username, room, socket }: ChatProps) {
  return (
    <div className={styles.chatContainer}>
      <RoomAndUsers socket={socket} username={username} room={room} />
      <div className={styles.chatMainGroup}>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  )
}
