// "use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.jsx"
import { CardProvider } from "./context/CardContext.jsx"
import { CardsPage } from "./pages/Cards.jsx"
import { StudyPage } from "./pages/Study.jsx"
import { StudySessionPage } from "./pages/StudySession.jsx"
import { ProgressPage } from "./pages/Progress.jsx"
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { EditCardPage } from "./pages/EditCard.jsx";
import Navbar from "./components/Navbar.jsx";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { AddCardPage } from "./pages/AddCard.jsx"
import { ToastContainer, toast } from 'react-toastify';

function AppContent() {
  const location = useLocation();
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LeoLearn</h1>
          {/* <p className="text-lg text-gray-600">Master anything with spaced repetition</p> */}
        </div>
        <ToastContainer />
          {/* <Navbar/> */}

          {location.pathname !== '/study/session' && location.pathname !== '/add-card' && <Navbar/>}
          <Routes>
            <Route path="/" element={<CardsPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/edit-deck" element={<EditCardPage />} />
            <Route path="/add-card" element={<AddCardPage />} />
            <Route path="/study/session" element={<StudySessionPage />} />
          </Routes>       
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <CardProvider>
      <AppContent />
    </CardProvider>
  )
}
