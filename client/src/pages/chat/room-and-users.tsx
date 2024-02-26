import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { SocketAction } from '../../const'
import styles from './styles.module.css'

export interface RoomAndUsersProps {
  socket: Socket
  username: string
  room: string
}

export default function RoomAndUsers({ socket, username, room }: RoomAndUsersProps) {
  const [roomUsers, setRoomUsers] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    socket.on(SocketAction.ChatroomUsers, data => {
      console.log('SocketAction.ChatroomUsers', data)
      setRoomUsers(data)
    })

    return () => void socket.off(SocketAction.ChatroomUsers)
  }, [socket])

  const leaveRoom = () => {
    socket.emit('leave_room', { username, room, date: Date.now() })
    navigate('/', { replace: true })
  }

  return (
    <div className={styles.roomAndUsersColumn}>
      <h2 className={styles.roomTitle}>{room}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
        <ul className={styles.usersList}>
          {roomUsers.map(user => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className="btn btn-outline" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  )
}
