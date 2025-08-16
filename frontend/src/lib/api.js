import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const fetchFlashcards = () => api.get("/flashcards").then((res) => res.data);
export const createFlashcard = (flashcard) =>
  api.post("/flashcards", flashcard).then((res) => res.data);
export const updateFlashcard = (id, flashcard) =>
  api.put(`/flashcards/${id}`, flashcard).then((res) => res.data);
export const deleteFlashcard = (id) => api.delete(`/flashcards/${id}`);


export const fetchDeck = () => api.get("/decks").then((res) => res.data);
export const createDeck = (deck) =>
  api.post("/decks", deck).then((res) => res.data);
export const updateDeck = (id, deck) =>
  api.put(`/decks/${id}`, deck).then((res) => res.data);
export const deleteDeck = (id) => api.delete(`/decks/${id}`);