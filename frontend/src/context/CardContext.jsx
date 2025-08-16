"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchFlashcards, createFlashcard, updateFlashcard as apiUpdateFlashcard, deleteFlashcard as apiDeleteFlashcard } from "../lib/api"

const CardContext = createContext()

const initialState = {
  decks: [
    {
      id: "1",
      name: "Default Deck",
      cards: [],
    },
  ],
  currentDeck: "1",
}

function cardReducer(state, action) {
  switch (action.type) {
    case "ADD_CARD":
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === state.currentDeck
        ? { ...deck, cards: [...deck.cards, action.payload] }
        : deck,
    ),
  }
case "SET_CARDS":
  return {
    ...state,
    decks: state.decks.map((deck) =>
      deck.id === state.currentDeck
        ? { ...deck, cards: action.payload.cards }
            : deck,
        ),
      }

    case "UPDATE_CARD":
      return {
        ...state,
        decks: state.decks.map((deck) => ({
          ...deck,
          cards: deck.cards.map((card) =>
            card.id === action.payload.id ? { ...card, ...action.payload.updates } : card,
          ),
        })),
      }

    case "DELETE_CARD":
      return {
        ...state,
        decks: state.decks.map((deck) => ({
          ...deck,
          cards: deck.cards.filter((card) => card.id !== action.payload.id),
        })),
      }

      case "ADD_DECK": {
      const newDeck = {
        id: Date.now().toString(),
        name: action.payload.name,
        cards: [],
      }
      return {
        ...state,
        decks: [...state.decks, newDeck],
      }
    }

    case "UPDATE_DECK":
      return {
        ...state,
        decks: state.decks.map((deck) => ({
          ...deck,
          cards: deck.cards.map((card) =>
            card.id === action.payload.id ? { ...card, ...action.payload.updates } : card,
          ),
        })),
      }

    case "DELETE_DECK": {
      const remainingDecks = state.decks.filter((deck) => deck.id !== action.payload.id)
      return {
        ...state,
        decks: remainingDecks,
        currentDeck: remainingDecks.length > 0 ? remainingDecks[0].id : null,
      }
    }
    case "SET_CURRENT_DECK":
      return {
        ...state,
        currentDeck: action.payload.deckId,
      }

    default:
      return state
  }
}

export function CardProvider({ children }) {
  const [state, dispatch] = useReducer(cardReducer, initialState) 
  const navigate = useNavigate();

  const getCurrentDeck = () => {
    return state.decks.find((deck) => deck.id === state.currentDeck)
  }

  useEffect(() => {
    fetchFlashcards()
      .then((data) => {
        const cards = data.map((f) => ({
          id: f.id?.toString(),
          front: f.frontText,
          back: f.backText,
          difficulty: f.easeFactor,
          interval: f.reviewIntervalDays,
          repetitions: f.repetitions,
          nextReview: f.nextReviewDate,
          createdAt: f.dateCreated,
          lastReviewed: f.lastReviewed,
          version: f.version,
        }))
        dispatch({ type: "SET_CARDS", payload: { cards } })

      })
      .catch((err) => console.error(err))
  }, [])

  const addCard = async (front, back) => {

    const currentDeck = state.decks.find(d => d.id === state.currentDeck)
    const lastCard = currentDeck?.cards[currentDeck.cards.length - 1]

    // console.log(state);

    const now = new Date()
    const payload = {
      frontText: front,
      backText: back,
      dateCreated: now.toISOString(),
      reviewIntervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewDate: now.toISOString(),
      deckId: parseInt(state.currentDeck),
    }
    // console.log(payload);
    
    try {
      const saved = await createFlashcard(payload)
      
      const card = {
        id: (parseInt(lastCard?.id) + 1).toString() || "1",
        front: saved.frontText,
        back: saved.backText,
        difficulty: saved.easeFactor,
        interval: saved.reviewIntervalDays,
        repetitions: saved.repetitions,
        nextReview: saved.nextReviewDate,
        createdAt: saved.dateCreated,
        lastReviewed: null,
        version: saved.version,
      }
      dispatch({ type: "ADD_CARD", payload: card })

      console.log(state);

      
      
    } catch (e) {
      console.error(e)
    }
  }

  const updateCard = async (id, updates) => {
    const currentDeck = getCurrentDeck()
    const existing = currentDeck.cards.find((c) => c.id === id)
    if (!existing) return
    const updated = { ...existing, ...updates }
    const payload = {
      id: parseInt(updated.id),
      frontText: updated.front,
      backText: updated.back,
      dateCreated: updated.createdAt,
      lastReviewed: updated.lastReviewed || updated.createdAt,
      reviewIntervalDays: updated.interval,
      easeFactor: updated.difficulty,
      repetitions: updated.repetitions,
      nextReviewDate: updated.nextReview,
      deckId: parseInt(currentDeck.id),
      version: updated.version,
    }
    try {
      const saved = await apiUpdateFlashcard(id, payload)
      dispatch({ type: "UPDATE_CARD", payload: { id, updates: { ...updates, version: saved.version } } })
    } catch (e) {
      console.error(e)
    }
  }

  const deleteCard = async (id) => {
    try {
      await apiDeleteFlashcard(id)
      dispatch({ type: "DELETE_CARD", payload: { id } })
    } catch (e) {
      console.error(e)
    }
  }

  const addDeck = (name) => {
    dispatch({ type: "ADD_DECK", payload: { name } })
  }

  const updateDeck = (id, updates) => {
    dispatch({ type: "UPDATE_DECK", payload: { id, updates } })
  }

  const deleteDeck = (id) => {
    dispatch({ type: "DELETE_DECK", payload: { id } })
  }

  const setCurrentDeck = (deckId) => {
    dispatch({ type: "SET_CURRENT_DECK", payload: { deckId } })
  }


  const getCardsForReview = () => {
    const currentDeck = getCurrentDeck()
    if (!currentDeck) return []

    const now = new Date()
    return currentDeck.cards.filter((card) => new Date(card.nextReview) <= now)
  }

  const value = {
    ...state,
    addCard,
    updateCard,
    deleteCard,
    addDeck,
    deleteDeck,
    setCurrentDeck,
    getCurrentDeck,
    getCardsForReview,
    navigate, // Include navigate in the context value
  }

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>
}

export function useCards() {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error("useCards must be used within a CardProvider")
  }
  return context
}
