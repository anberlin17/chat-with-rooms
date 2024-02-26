import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Chat from './pages/chat'
import io from 'socket.io-client'
import styles from './styles.module.css'

const port = 3000
const socket = io(`http://localhost:${port}`)

export default function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')

  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route
            path="/"
            element={
              <Home username={username} setUsername={setUsername} room={room} setRoom={setRoom} socket={socket} />
            }
          />
          <Route path="/chat" element={<Chat username={username} room={room} socket={socket} />} />
        </Routes>
      </div>
    </Router>
  )
}
