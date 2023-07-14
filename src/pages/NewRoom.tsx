import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'

import { ref, push } from 'firebase/database'
import { database } from '../services/firebase'

export function NewRoom() {
  const [newRoom, setNewRoom] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  async function createNewRoom(e: FormEvent) {
    e.preventDefault()

    if (newRoom.trim() == '') {
      return
    }

    const roomRef = ref(database, 'rooms')

    const firebaseRoom = await push(roomRef, {
      title: newRoom,
      authorId: user?.id
    })

    navigate(`/rooms/${firebaseRoom.key}`)
  }

  return (
    <div className="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolziando perguntas e repostas"
        />
        <strong>Crie salas de Q&A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={createNewRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={e => setNewRoom(e.target.value)}
            />
            <Button type="submit">Criar sala </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
