"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Trash2, Edit, Eye, EyeOff } from "lucide-react"
import { useCards } from "../context/CardContext"

export function CardList({ onEditCard }) {
  const { getCurrentDeck, deleteCard } = useCards()
  const [flippedCards, setFlippedCards] = useState(new Set())
  const currentDeck = getCurrentDeck()

  if (!currentDeck || currentDeck.cards.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No cards in this deck yet. Add some cards to get started!</p>
        </CardContent>
      </Card>
    )
  }

  const toggleCardFlip = (cardId) => {
    const newFlipped = new Set(flippedCards)
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId)
    } else {
      newFlipped.add(cardId)
    }
    setFlippedCards(newFlipped)
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 2.0) return "destructive"
    if (difficulty < 2.5) return "secondary"
    return "default"
  }

  const getIntervalText = (interval) => {
    if (interval < 1) return "New"
    if (interval === 1) return "1 day"
    if (interval < 30) return `${Math.round(interval)} days`
    return `${Math.round(interval / 30)} months`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Cards in {currentDeck.name} ({currentDeck.cards.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {currentDeck.cards.map((card) => {
          const isFlipped = flippedCards.has(card.id)
          const nextReview = new Date(card.nextReview)
          const isOverdue = nextReview <= new Date()

          return (
            <Card key={card.id} className={`transition-all ${isOverdue ? "border-orange-200 bg-orange-50" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getDifficultyColor(card.difficulty)}>
                        Difficulty: {card.difficulty.toFixed(1)}
                      </Badge>
                      <Badge variant="outline">{getIntervalText(card.interval)}</Badge>
                      {isOverdue && <Badge variant="destructive">Due for review</Badge>}
                    </div>
                    <CardTitle className="text-base">{isFlipped ? "Answer:" : "Question:"}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleCardFlip(card.id)}>
                      {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEditCard?.(card)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCard(card.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{isFlipped ? card.back : card.front}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p>Next review: {nextReview.toLocaleDateString()}</p>
                  <p>Repetitions: {card.repetitions}</p>
                  {card.lastReviewed && <p>Last reviewed: {new Date(card.lastReviewed).toLocaleDateString()}</p>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
