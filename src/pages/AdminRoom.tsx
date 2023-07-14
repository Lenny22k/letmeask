import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import deleteImg from '.././assets/images/delete.svg'
import checkImg from '.././assets/images/check.svg'
import answerImg from '.././assets/images/answer.svg'

import logoImg from '../assets/images/logo.svg'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { ref, remove, update } from 'firebase/database'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id!
  const { title, questions } = useRoom(roomId)
  const navigate = useNavigate()

  //-NXwjkN5rLrkmBCKxhX2

  async function handleDeleteRoom() {
    const roomRef = ref(database, `rooms/${roomId}`)

    await update(roomRef, {
      closedAt: new Date()
    })

    navigate('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Você tem certeza que deseja excluir')) {
      const questionRef = ref(
        database,
        `rooms/${roomId}/question/${questionId}`
      )

      await remove(questionRef)
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/question/${questionId}`)
    await update(questionRef, {
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/question/${questionId}`)
    await update(questionRef, {
      isHighlighted: true
    })
  }

  return (
    <div className="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleDeleteRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
