import { Socket } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

export interface HomeProps {
  username: string
  room: string
  socket: Socket
  setUsername: (username: string) => void
  setRoom: (room: string) => void
}

export default function Home({ username, setUsername, room, setRoom, socket }: HomeProps) {
  const navigate = useNavigate()

  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('join_room', { username, room })
    }

    navigate('/chat', { replace: true })
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>DevRooms</>`}</h1>
        <input className={styles.input} placeholder="Username..." onChange={ev => setUsername(ev.target.value)} />

        <select className={styles.input} onChange={ev => setRoom(ev.target.value)}>
          <option>-- Select Room --</option>
          <option value="javascript">JavaScript</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="react">React</option>
        </select>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={joinRoom}>
          Join Room
        </button>
      </div>
    </div>
  )
}
