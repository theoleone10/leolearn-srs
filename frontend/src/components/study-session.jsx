"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Eye, CheckCircle } from "lucide-react"
import { useCards } from "../context/CardContext"

export function StudySession({ onComplete }) {
  const { getCardsForReview, updateCard, getCurrentDeck } = useCards()
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    completed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  const currentDeck = getCurrentDeck()

  useEffect(() => {
    const reviewCards = getCardsForReview()
    setCards(reviewCards)
    setSessionStats((prev) => ({ ...prev, total: reviewCards.length }))
  }, [getCardsForReview])

  if (!currentDeck) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Please select a deck first.</p>
        </CardContent>
      </Card>
    )
  }

  if (cards.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Great job!</h3>
            <p className="text-muted-foreground">No cards are due for review right now.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Come back later or add more cards to continue studying.
            </p>
          </div>
          <Button onClick={onComplete}>Back to Cards</Button>
        </CardContent>
      </Card>
    )
  }

  const currentCard = cards[currentCardIndex]
  const progress = (sessionStats.completed / sessionStats.total) * 100

  const calculateNextReview = (difficulty, interval, repetitions, quality) => {
    let newDifficulty = difficulty
    let newInterval = interval
    let newRepetitions = repetitions

    if (quality >= 3) {
      if (repetitions === 0) {
        newInterval = 1
      } else if (repetitions === 1) {
        newInterval = 6
      } else {
        newInterval = Math.round(interval * newDifficulty)
      }
      newRepetitions += 1
    } else {
      newRepetitions = 0
      newInterval = 1
    }

    newDifficulty = newDifficulty + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    newDifficulty = Math.max(1.3, newDifficulty)

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + newInterval)

    return {
      difficulty: newDifficulty,
      interval: newInterval,
      repetitions: newRepetitions,
      nextReview,
      lastReviewed: new Date(),
    }
  }

  const handleAnswer = (quality) => {
    const updates = calculateNextReview(currentCard.difficulty, currentCard.interval, currentCard.repetitions, quality)

    updateCard(currentCard.id, updates)

    // Update session stats
    const qualityNames = ["again", "hard", "good", "easy"]
    const qualityName = qualityNames[quality - 1] || "again"

    setSessionStats((prev) => ({
      ...prev,
      completed: prev.completed + 1,
      [qualityName]: prev[qualityName] + 1,
    }))

    // Move to next card or complete session
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      onComplete?.()
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>
            {sessionStats.completed} / {sessionStats.total}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Current Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{showAnswer ? "Answer" : "Question"}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Card {currentCardIndex + 1} of {cards.length}
              </Badge>
              <Badge variant="secondary">Difficulty: {currentCard.difficulty.toFixed(1)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-lg text-center whitespace-pre-wrap">
              {showAnswer ? currentCard.back : currentCard.front}
            </p>
          </div>

          {!showAnswer ? (
            <div className="flex justify-center">
              <Button onClick={() => setShowAnswer(true)} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Show Answer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">How well did you know this answer?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleAnswer(1)}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <span className="font-semibold">Again</span>
                  <span className="text-xs opacity-90">&lt; 1 day</span>
                </Button>
                <Button variant="secondary" onClick={() => handleAnswer(2)} className="flex flex-col gap-1 h-auto py-3">
                  <span className="font-semibold">Hard</span>
                  <span className="text-xs opacity-90">1-3 days</span>
                </Button>
                <Button variant="default" onClick={() => handleAnswer(3)} className="flex flex-col gap-1 h-auto py-3">
                  <span className="font-semibold">Good</span>
                  <span className="text-xs opacity-90">4-7 days</span>
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleAnswer(4)}
                  className="flex flex-col gap-1 h-auto py-3 bg-green-600 hover:bg-green-700"
                >
                  <span className="font-semibold">Easy</span>
                  <span className="text-xs opacity-90">1+ weeks</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Stats */}
      {sessionStats.completed > 0 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">{sessionStats.again}</div>
                <div className="text-xs text-muted-foreground">Again</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{sessionStats.hard}</div>
                <div className="text-xs text-muted-foreground">Hard</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{sessionStats.good}</div>
                <div className="text-xs text-muted-foreground">Good</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{sessionStats.easy}</div>
                <div className="text-xs text-muted-foreground">Easy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
