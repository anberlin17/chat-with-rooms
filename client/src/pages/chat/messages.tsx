import { useState, useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { Message } from '../../types'
import styles from './styles.module.css'
import { SocketAction } from '../../const'

export interface MessagesProps {
  socket: Socket
}

export default function Messages({ socket }: MessagesProps) {
  const [messagesRecieved, setMessagesReceived] = useState<Message[]>([])
  const messagesColumnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.on(SocketAction.NewMessage, (data: Message | Message[]) => {
      console.debug('SocketAction.NewMessage', data)
      const newMessages = Array.isArray(data) ? data : [data]
      setMessagesReceived(state => [...state, ...newMessages])
    })

    socket.on(SocketAction.History, (data: Message[]) => {
      console.debug('SocketAction.History', data)
      setMessagesReceived(data)
    })

    return () => {
      socket.off(SocketAction.NewMessage)
      socket.off(SocketAction.History)
    }
  }, [socket])

  useEffect(() => {
    messagesColumnRef.current?.scrollTo(0, messagesColumnRef.current.scrollHeight)
  }, [messagesRecieved])

  function formatDateFromTimestamp(timestamp: number) {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved.map((msg, idx) => (
        <div className={styles.message} key={idx}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>{formatDateFromTimestamp(msg.date)}</span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  )
}
