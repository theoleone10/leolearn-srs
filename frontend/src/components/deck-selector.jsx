"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Trash2, Plus, BookOpen, Edit } from "lucide-react"
import { useCards } from "../context/CardContext"

export function DeckSelector() {
  const { decks, currentDeck, addDeck, deleteDeck, setCurrentDeck, navigate } = useCards()
  const [newDeckName, setNewDeckName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateDeck = (e) => {
    e.preventDefault()
    if (!newDeckName.trim()) return

    addDeck(newDeckName.trim())
    setNewDeckName("")
    setIsDialogOpen(false)
  }

  const handleDeleteDeck = (deckId) => {
    if (decks.length <= 1) {
      alert("You must have at least one deck!")
      return
    }

    if (confirm("Are you sure you want to delete this deck? All cards will be lost.")) {
      deleteDeck(deckId)
    }
  }

  const getCardCount = (deck) => {
    return deck.cards ? deck.cards.length : 0
  }

  const getDueCount = (deck) => {
    if (!deck.cards) return 0
    const now = new Date()
    return deck.cards.filter((card) => new Date(card.nextReview) <= now).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Decks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600] hover:bg-blue-400 hover:text-white hover:shadow-[0_0_10px_bg-blue-600]">
              <Plus className="h-4 w-4 mr-2" />
              New Deck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateDeck} className="space-y-4">
              <Input
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="Enter deck name..."
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Deck</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-1" >
        {decks.map((deck, index) => {
          const cardCount = getCardCount(deck)
          const dueCount = getDueCount(deck)
          const isSelected = deck.id === currentDeck
          return (
            <Card
              key={`${deck.id}-${index}`}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setCurrentDeck(deck.id)}
              onDoubleClick={() => {navigate('/study')}}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2" >
                      
                              
                      <BookOpen className="h-5 w-5"   />
                      {deck.name}
                    </CardTitle>
                  </div>
                  <Button 
                    variant="edit"
                    size="sm"
                    onClick={() => navigate('/add-card?edit=false')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Plus className="h-4 w-4"/>
                  </Button>
                  <Button
                    variant="edit"
                    size="sm"
                    onClick={() => navigate('/edit-deck')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {decks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteDeck(deck.id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
              
                  )}
                  
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-x-1 sm:gap-x-8">
                  <div className="flex items-center justify-start text-sm">
                    <span className="text-muted-foreground">Total Cards:</span>
                    <Badge variant="secondary">{cardCount}</Badge>
                  </div>
                  {dueCount > 0 && (
                    <div className="flex items-center justify-start text-sm">
                      <span className="text-muted-foreground">Due for Review:</span>
                      <Badge variant="destructive">{dueCount}</Badge>
                    </div>
                  )}
                  {isSelected && (
                    <div className="">
                      <Badge variant="default" className="text-xs">
                        Currently Selected
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
