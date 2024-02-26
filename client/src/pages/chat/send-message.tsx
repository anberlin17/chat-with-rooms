import { useState } from 'react'
import { Socket } from 'socket.io-client'
import { SocketAction } from '../../const'
import styles from './styles.module.css'

export interface SendMessageProps {
  socket: Socket
  username: string
  room: string
}

export default function SendMessage({ socket, username, room }: SendMessageProps) {
  const [message, setMessage] = useState('')

  const sendMessage = () => {
    if (message !== '') {
      socket.emit(SocketAction.NewMessage, { username, room, message: message.trim(), date: Date.now() })
      setMessage('')
    }
  }

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder="Message..."
        onChange={e => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  )
}
