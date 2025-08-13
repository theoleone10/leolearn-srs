"use client"
import React from 'react'
import { useState } from "react"
import { CardForm } from "../components/card-form"
import { CardList } from "../components/card-list"
import { DeckSelector } from "../components/deck-selector"


export function AddCardPage() {
    const [editingCard, setEditingCard] = useState(null)

    const handleEditCard = (card) => {
      setEditingCard(card)
    }
  
    const handleCancelEdit = () => {
      setEditingCard(null)
    }

  return (
    <div className="space-y-8">
      {/* <DeckSelector /> */}
      <CardForm editingCard={editingCard} onCancel={handleCancelEdit} />
      {/* <CardList onEditCard={handleEditCard} /> */}
    </div>
  )
}


