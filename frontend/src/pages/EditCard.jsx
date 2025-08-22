"use client"
import React, { useEffect } from 'react'
import { useState } from "react"
import { CardForm } from "../components/card-form"
import { CardList } from "../components/card-list"
import { DeckSelector } from "../components/deck-selector"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { useCards } from "../context/CardContext"
import { Input } from "../components/ui/input"
import { DeckForm } from '../components/deck-form'


export function EditCardPage() {
  
  const navigate = useNavigate()



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
      
      <DeckForm />
      <CardList />
    </div>
  )
}


