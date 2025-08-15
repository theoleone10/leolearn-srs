"use client"

import { StudySession } from "../components/study-session"
import { useNavigate } from "react-router-dom"

export function StudySessionPage() {
  const navigate = useNavigate()

  const handleComplete = () => {
    navigate("/study")
  }

  return <StudySession onComplete={handleComplete} />
}