import { useNavigate } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIcon from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'
import { ref, get } from 'firebase/database'

export function Home() {
  const [roomCode, setRoomCode] = useState('')

  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    navigate('/rooms/new')
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault()

    if (roomCode.trim() == '') {
      return
    }

    const roomRef = ref(database, `rooms/${roomCode}`)

    get(roomRef).then(room => {
      if (!room.exists()) {
        alert('Room does not exists.')
        return
      }

      if (room.val().closedAt) {
        alert('Room already closed.')
        return
      }

      navigate(`/rooms/${roomCode}`)
    })
  }

  return (
    <div className="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIcon} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
