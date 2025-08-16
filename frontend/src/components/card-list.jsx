"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Trash2, Edit, Eye, EyeOff } from "lucide-react"
import { useCards } from "../context/CardContext"

export function CardList({ onEditCard }) {
  const { getCurrentDeck, deleteCard, updateCard } = useCards()
  const [flippedCards, setFlippedCards] = useState(new Set())
  const currentDeck = getCurrentDeck()
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")

  const [editingCard, setEditingCard] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return

    updateCard(editingCard.id, { front: front.trim(), back: back.trim() })
    // toast.success("Card updated successfully!")

    setEditingCard(null)

  }

  if (!currentDeck || !currentDeck.cards || currentDeck.cards.length === 0) {
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
    if (interval < 1) return "Soon"
    if (interval === 1) return "1 day"
    if (interval <= 30) return `${(interval)} days`
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
          const isOverdue = card.nextReview <= new Date().toISOString()


          return (
            editingCard?.id !== card.id ? (
              <Card key={card.id} className={`transition-all ${isOverdue ? "border-orange-200 bg-orange-50" : ""}`}>
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <p className="whitespace-pre-wrap">{isFlipped ? card.back : card.front}</p>
                    <div className="flex gap-1">
                      <div className={`flex items-center gap-2`}>

                        {!isOverdue ? <Badge variant="outline" className=' bg-blue-300'>{getIntervalText(Math.round((nextReview - new Date()) / (1000 * 60 * 60 * 24)))}</Badge>
                          : <Badge variant="destructive">Due for review</Badge>}
                      </div>
                      {/* <CardTitle className="text-base">{isFlipped ? "Answer:" : "Question:"}</CardTitle> */}
                      {/* </div>
                  <div className="flex gap-1"> */}
                      <Button variant="ghost" size="sm" onClick={() => toggleCardFlip(card.id)}>
                        {!isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingCard(card)

                        setFront(card.front)
                        setBack(card.back)
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ) : (

              <Card key={card.id} className={`transition-all ${isOverdue ? "border-orange-200 bg-orange-50" : ""}`}>
                <CardHeader className="">
                  <div className="flex items-center justify-between w-full">
                  <CardTitle className="whitespace-pre-wrap text-">Edit Card</CardTitle>
                    <div className="flex-1 gap-1">
                      
                    </div>
                  <div className="flex gap-1">
                  {!isOverdue ? <Badge variant="outline">{getIntervalText((nextReview - new Date()) / (1000 * 60 * 60 * 24))}</Badge>
  : <Badge variant="destructive">Due for review</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingCard(null)

                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="front" className="block text-sm font-medium mb-2">Question: </label>
                    <Textarea
                      id="front"
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      placeholder={card.front}
                      className="min-h-[100px]" required />
                    <label htmlFor="back" className="block text-sm font-medium mb-2">Answer: </label>
                    <Textarea
                      id="back"
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      placeholder={card.back}
                      className="min-h-[100px]" required />
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setEditingCard(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" className='bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600] hover:bg-blue-400 hover:text-white hover:shadow-[0_0_10px_bg-blue-600]'>Update Card</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )
          )
        })}
      </div>
    </div>
  )
}
