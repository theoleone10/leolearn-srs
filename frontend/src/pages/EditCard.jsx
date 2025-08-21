"use client"
import React from 'react'
import { useState } from "react"
import { CardForm } from "../components/card-form"
import { CardList } from "../components/card-list"
import { DeckSelector } from "../components/deck-selector"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { useCards } from "../context/CardContext"
import { Input } from "../components/ui/input"


export function EditCardPage() {
  const { getCurrentDeck, updateDeck } = useCards()
  const currentDeck = getCurrentDeck()
  const navigate = useNavigate()

  const [newDeckName, setNewDeckName] = useState(currentDeck?.name || "")
  const [newDeckDescription, setNewDeckDescription] = useState(currentDeck?.description || "")
  const [newDeckCardsPerDay, setNewDeckCardsPerDay] = useState(currentDeck?.cardsPerDay || 20)


  const handleCreateDeck = (e) => {
    e.preventDefault()
    if (!newDeckName.trim()) return

    console.log(newDeckName.trim(), newDeckDescription.trim(), newDeckCardsPerDay);
    console.log(currentDeck.id, currentDeck.dateCreated);
    
    

    updateDeck(currentDeck.id,  { name:newDeckName.trim(), description: newDeckDescription.trim(), cardsPerDay: newDeckCardsPerDay, dateCreated: currentDeck.dateCreated })
    // setNewDeckName(""),
    // setNewDeckDescription("")
    // setNewDeckCardsPerDay(20)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-start mt-4">
        <Button
          onClick={() => navigate(-1 || '/')}
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2">
          <ArrowLeft className="h-5 w-5" />
          Exit
        </Button>
      </div>
      <form onSubmit={handleCreateDeck} className="space-y-4">
        <label htmlFor="deckName" className="block text-sm font-medium mb-2">
          Deck Name:
        </label>
        <Input
          value={newDeckName}
          id="deckName"
          onChange={(e) => setNewDeckName(e.target.value)}
          placeholder="Enter deck name..."
          autoFocus
          required
        />
        <label htmlFor="deckDescription" className="block text-sm font-medium mb-2">
          Deck Description:
        </label>
        <Input
          value={newDeckDescription}
          id="deckDescription"
          onChange={(e) => setNewDeckDescription(e.target.value)}
          placeholder="Enter deck description..."
          autoFocus
        />
        <label htmlFor="deckCardsPerDay" className="block text-sm font-medium mb-2">
          Cards Per Day:
        </label>
        <Input
          value={newDeckCardsPerDay}
          id="deckCardsPerDay"
          onChange={(e) => setNewDeckCardsPerDay(e.target.value)}
          placeholder="Enter deck description..."
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className='bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600] hover:bg-blue-400 hover:text-white hover:shadow-[0_0_10px_bg-blue-600]'>Create Deck</Button>
        </div>
      </form>



      <CardList />
    </div>
  )
}


