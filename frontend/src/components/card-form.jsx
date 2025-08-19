"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { toast } from "react-toastify";
import { useCards } from "../context/CardContext"

export function CardForm({ editingCard, onCancel }) {
  const { addCard, updateCard } = useCards()
  const [front, setFront] = useState(editingCard?.front || "")
  const [back, setBack] = useState(editingCard?.back || "")
  const [frontImage, setFrontImage] = useState(null)
  const [backImage, setBackImage] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return

    if (editingCard) {
      updateCard(editingCard.id, { front: front.trim(), back: back.trim() })
    } else {
      addCard(front.trim(), back.trim(), frontImage, backImage)

      toast.success("Card added successfully!")
      
    }

    setFront("")
    setBack("")
    setFrontImage(null)
    setBackImage(null)
    onCancel?.()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editingCard ? "Edit Card" : "Add New Card"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="front" className="block text-sm font-medium mb-2">
              Front (Question)
            </label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter the question or prompt..."
              className="min-h-[100px]"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFrontImage(e.target.files[0])}
              className="mt-2"
            />
          </div>

          <div>
            <label htmlFor="back" className="block text-sm font-medium mb-2">
              Back (Answer)
            </label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter the answer or explanation..."
              className="min-h-[100px]"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBackImage(e.target.files[0])}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {editingCard && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" className='bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600] hover:bg-blue-400 hover:text-white hover:shadow-[0_0_10px_bg-blue-600]'>{editingCard ? "Update Card" : "Add Card"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
