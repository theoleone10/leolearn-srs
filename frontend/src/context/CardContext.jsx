"use client"

import { createContext, useContext, useReducer } from "react"

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
            ? {
                ...deck,
                cards: [
                  ...deck.cards,
                  {
                    id: Date.now().toString(),
                    front: action.payload.front,
                    back: action.payload.back,
                    difficulty: 2.5,
                    interval: 1,
                    repetitions: 0,
                    nextReview: new Date(),
                    createdAt: new Date(),
                    lastReviewed: null,
                  },
                ],
              }
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

  const addCard = (front, back) => {
    dispatch({ type: "ADD_CARD", payload: { front, back } })
  }

  const updateCard = (id, updates) => {
    dispatch({ type: "UPDATE_CARD", payload: { id, updates } })
  }

  const deleteCard = (id) => {
    dispatch({ type: "DELETE_CARD", payload: { id } })
  }

  const addDeck = (name) => {
    dispatch({ type: "ADD_DECK", payload: { name } })
  }

  const deleteDeck = (id) => {
    dispatch({ type: "DELETE_DECK", payload: { id } })
  }

  const setCurrentDeck = (deckId) => {
    dispatch({ type: "SET_CURRENT_DECK", payload: { deckId } })
  }

  const getCurrentDeck = () => {
    return state.decks.find((deck) => deck.id === state.currentDeck)
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
