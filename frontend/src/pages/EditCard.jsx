"use client"
import React from 'react'
import { useState } from "react"
import { CardForm } from "../components/card-form"
import { CardList } from "../components/card-list"
import { DeckSelector } from "../components/deck-selector"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"


export function EditCardPage() {
    // const [editingCard, setEditingCard] = useState(null)

    const navigate = useNavigate()

    // const handleEditCard = (card) => {
    //   setEditingCard(card)
    // }
  
    // const handleCancelEdit = () => {
    //   setEditingCard(null)
    // }

  return (
    <div className="space-y-8">
      <div className="flex justify-start mt-4">
        <Button 
          onClick={()=>navigate(-1 || '/')} 
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2">
          <ArrowLeft className="h-5 w-5" />
          Exit
        </Button>
      </div>
      {/* <DeckSelector /> */}
      {/* <CardForm editingCard={editingCard} onCancel={handleCancelEdit} /> */}
      <CardList/>
    </div>
  )
}


