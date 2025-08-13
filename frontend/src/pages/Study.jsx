"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { StudySession } from "../components/study-session"
import { Brain, BookOpen } from "lucide-react"
import { useCards } from "../context/CardContext"

export function StudyPage() {
  const { getCurrentDeck, getCardsForReview } = useCards()
  const [isStudying, setIsStudying] = useState(false)

  const currentDeck = getCurrentDeck()
  const cardsForReview = getCardsForReview()

  const handleStartStudy = () => {
    setIsStudying(true)
  }

  const handleCompleteStudy = () => {
    setIsStudying(false)
  }

  if (isStudying) {
    return <StudySession onComplete={handleCompleteStudy} />
  }

  if (!currentDeck) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Please select a deck to start studying.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Study Session</h2>
        <p className="text-muted-foreground">
          Ready to review your cards from <strong>{currentDeck.name}</strong>?
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {currentDeck.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentDeck.cards.length}</div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{cardsForReview.length}</div>
              <div className="text-sm text-muted-foreground">Due for Review</div>
            </div>
          </div>

          {cardsForReview.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="destructive" className="text-sm">
                  {cardsForReview.length} cards ready to review
                </Badge>
              </div>
              <Button onClick={handleStartStudy} className="w-full" size="lg">
                <Brain className="h-5 w-5 mr-2" />
                Start Study Session
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-600">
                <Brain className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">All caught up!</p>
                <p className="text-sm text-muted-foreground">No cards are due for review right now.</p>
              </div>
              <p className="text-xs text-muted-foreground">Come back later or add more cards to continue studying.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
