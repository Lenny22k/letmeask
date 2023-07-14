import { off, onValue, ref } from 'firebase/database'
import {  useState, useEffect } from 'react'
import { database } from '../services/firebase'
import { useAuth } from './useAuth'

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likedId: string | undefined
}

type FireBaseQuestion = Record<
  string,
  {
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean;
    likes: Record<string, {
      authorId: string
    }>
  }
>

export function useRoom(roomId: string) {
  const {user} = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`)

    onValue(roomRef, room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FireBaseQuestion = databaseRoom.question ?? {}

      const parsedQuestion = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likedId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
          }
        }
      )
      setTitle(databaseRoom.title)
      setQuestions(parsedQuestion)
    })

    return () => {
      off(roomRef, 'value')
    }
  }, [roomId, user?.id])

  return { questions, title} 
}