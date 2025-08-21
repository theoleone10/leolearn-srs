"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchFlashcards, createFlashcard, updateFlashcard as apiUpdateFlashcard, deleteFlashcard as apiDeleteFlashcard, fetchDeck, reviewFlashcard as apiReviewFlashcard } from "../lib/api"

const CardContext = createContext()

const emptyState = {
  decks: [],
  currentDeck: null,
}

function cardReducer(state, action) {
  const withCardsArray = (deck) => ({ ...deck, cards: Array.isArray(deck.cards) ? deck.cards : [] });

  switch (action.type) {
    
    case "ADD_CARD": {
      const { deckId } = action.payload;
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? { ...withCardsArray(deck), cards: [...deck.cards, action.payload] }
            : deck
        ),
      };
    }
    case "SET_CARDS": {
      const cards = action.payload.cards ?? [];
      return {
        ...state,
        decks: state.decks.map((deck) => ({
          ...withCardsArray(deck),
          cards: cards.filter((card) => card.deckId === deck.id),
        })),
      };
    }

    
    case "UPDATE_CARD": {
      const { deckId, id, updates } = action.payload;
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? {
                ...withCardsArray(deck),
                cards: deck.cards.map((card) =>
                  card.id === id ? { ...card, ...updates } : card
                ),
              }
            : deck
        ),
      };
    }
    
    case "DELETE_CARD": {
      const { deckId, id } = action.payload;
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === deckId
            ? {
                ...withCardsArray(deck),
                cards: deck.cards.filter((card) => card.id !== id),
              }
            : deck
        ),
      };
    }
    case "ADD_DECK":
      return {
        ...state,
        decks: [...state.decks, withCardsArray(action.payload)],
      };

    case "SET_DECKS": {
      // Preserve any existing cards arrays when server decks arrive
      const incoming = (action.payload.decks ?? []).map((d) => {
        const existing = state.decks.find((x) => x.id === d.id);
        return withCardsArray({ ...d, cards: existing?.cards });
      });

      const nextCurrent =
        incoming.find((d) => d.id === state.currentDeck)?.id ??
        incoming[0]?.id ??
        null;

      return {
        ...state,
        decks: incoming,
        currentDeck: nextCurrent,
      };
    }

    case "UPDATE_DECK":
      return {
        ...state,
        decks: state.decks.map((deck) =>
          deck.id === action.payload.id
            ? { ...withCardsArray(deck), ...action.payload.updates }
            : deck
        ),
      };

    case "DELETE_DECK": {
      const remainingDecks = state.decks.filter((deck) => deck.id !== action.payload.id);
      return {
        ...state,
        decks: remainingDecks,
        currentDeck: remainingDecks.length > 0 ? remainingDecks[0].id : null,
      };
    }

    case "SET_CURRENT_DECK":
      return {
        ...state,
        currentDeck: action.payload.deckId,
      };

    default:
      return state;
  }
}


export function CardProvider({ children }) {
  const [state, dispatch] = useReducer(
    cardReducer,
    undefined,
    () => {
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("cardState")
        if (stored) {
          try {
            return JSON.parse(stored)
          } catch (e) {
            console.error("failed to parse stored card state", e)
          }
        }
      }
      return emptyState
    }
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cardState", JSON.stringify(state))
    }
  }, [state])

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
          frontImage: f.frontImageUrl,
          backImage: f.backImageUrl,
          difficulty: f.easeFactor,
          interval: f.reviewIntervalDays,
          repetitions: f.repetitions,
          nextReview: f.nextReviewDate,
          createdAt: f.dateCreated,
          lastReviewed: f.lastReviewed,
          version: f.version,
          deckId: f.deckId?.toString(),
        }))
        dispatch({ type: "SET_CARDS", payload: { cards } })

      })
      .catch((err) => console.error(err))
  }, [])

  

  useEffect(() => {
    fetchDeck()
      .then((data) => {
        const decks = data.map((f) => ({
          id: f.id?.toString(),
          name: f.name,
          description: f.description,
          createdAt: f.dateCreated,
        }))
        dispatch({ type: "SET_DECKS", payload: { decks } })

      })
      .catch((err) => console.error(err))
  }, [])

  const addCard = async (front, back, frontImage, backImage) => {
    const formData = new FormData()
    if (front) formData.append("frontText", front)
    if (back) formData.append("backText", back)
    formData.append("deckId", state.currentDeck)
    if (frontImage) formData.append("frontImage", frontImage)
    if (backImage) formData.append("backImage", backImage)
    
    try {
      const saved = await createFlashcard(formData)
      
      const card = {
        id: saved.id?.toString(),
        front: saved.frontText,
        back: saved.backText,
        frontImage: saved.frontImageUrl,
        backImage: saved.backImageUrl,
        difficulty: saved.easeFactor,
        interval: saved.reviewIntervalDays,
        repetitions: saved.repetitions,
        nextReview: saved.nextReviewDate,
        createdAt: saved.dateCreated,
        lastReviewed: saved.lastReviewed,
        version: saved.version,
        deckId: state.currentDeck,
      }
      dispatch({ type: "ADD_CARD", payload: card })
      
      
    } catch (e) {
      console.error(e)
    }
  }

  const reviewCard = async (id, rating) => {
    const currentDeck = getCurrentDeck()
    if (!currentDeck) return
    try {
      const updated = await apiReviewFlashcard(id, rating)
      const updates = {
        front: updated.frontText,
        back: updated.backText,
        frontImage: updated.frontImageUrl,
        backImage: updated.backImageUrl,
        difficulty: updated.easeFactor,
        interval: updated.reviewIntervalDays,
        repetitions: updated.repetitions,
        nextReview: updated.nextReviewDate,
        createdAt: updated.dateCreated,
        lastReviewed: updated.lastReviewed,
        version: updated.version,
        deckId: updated.deckId?.toString(),
      }
      dispatch({
        type: "UPDATE_CARD",
        payload: { deckId: currentDeck.id, id: id.toString(), updates },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const updateCard = async (id, updates) => {
    const currentDeck = getCurrentDeck()
  const existing = (currentDeck?.cards ?? []).find((c) => c.id === id)
  if (!existing) return
    const updated = { ...existing, ...updates }
    const payload = {
      id: parseInt(updated.id),
      frontText: updated.front,
      backText: updated.back,
      frontImageUrl: updated.frontImage,
      backImageUrl: updated.backImage,
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
      dispatch({
        type: "UPDATE_CARD",
        payload: { deckId: currentDeck.id, id, updates: { ...updates, version: saved.version } },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const deleteCard = async (id) => {
    try {
      await apiDeleteFlashcard(id)
      const currentDeck = getCurrentDeck()
      dispatch({ type: "DELETE_CARD", payload: { deckId: currentDeck.id, id } })
    } catch (e) {
      console.error(e)
    }
  }

  const addDeck = async (name, description, cardsPerDay) => {
    try {
      const dateCreated = new Date().toISOString().replace('Z', ''); // ISO local datetime
  
      const { data } = await axios.post(
        "http://localhost:8080/api/decks",
        {
          name,                     // use the param you passed in
          description,
          dateCreated,
          cardsPerDay
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const deck = {
        id: data.id?.toString(),   // axios puts payload under .data
        name: data.name,
        description: data.description,
        createdAt: data.dateCreated,
        cardsPerDay: data.cardsPerDay,
      };
  
      dispatch({ type: "ADD_DECK", payload: deck });
    } catch (e) {
      console.error("create deck failed", e?.response?.status, e?.response?.data || e);
    }
  };

  const updateDeck = async (id, updates) => {
    const existing = state.decks.find((d) => d.id === id.toString())
    if (!existing) return
    try {
      const payload = {
        id,
        name: updates.name ?? existing.name,
        description: updates.description ?? existing.description,
        dateCreated: existing.createdAt,
        cardsPerDay: updates.cardsPerDay ?? existing.cardsPerDay,
      }
      const { data } = await axios.put(
        `http://localhost:8080/api/decks/${id}`,
        payload)

        const deck = {
          name: data.name,
          description: data.description,
          createdAt: data.dateCreated,
          cardsPerDay: data.cardsPerDay,
        }
  
        dispatch({ type: "UPDATE_DECK", payload: { id, updates: deck } })


    } catch (e) {
      console.error("update deck failed", e?.response?.status, e?.response?.data || e)
    }
  }

  const deleteDeck = async (id) => {
    try {
      await axios.delete(
        "http://localhost:8080/api/decks/" + id
      );
  
      dispatch({ type: "DELETE_DECK", payload: { id } });
    } catch (e) {
      console.error("delete deck failed", e?.response?.status, e?.response?.data || e);
    }
    
  }

  const setCurrentDeck = async (deckId) => {
    try {
      await axios.get(
        "http://localhost:8080/api/decks/" + deckId,
        { headers: { "Content-Type": "application/json" } }
      );
  
      dispatch({ type: "SET_CURRENT_DECK", payload: { deckId } });
    } catch (e) {
      console.error("set current deck failed", e?.response?.status, e?.response?.data || e);
    }
  }


  const getCardsForReview = () => {
    const currentDeck = getCurrentDeck()
    
    if (!currentDeck) return []

    const now = new Date().toISOString()
    

    return (currentDeck.cards ?? [])
    .filter((card) => card.nextReview <= now)
  }

  const value = {
    ...state,
    addCard,
    reviewCard,
    updateCard,
    deleteCard,
    addDeck,
    updateDeck,
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
