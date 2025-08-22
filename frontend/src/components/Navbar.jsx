import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpen, Brain, BarChart3 } from "lucide-react"
import { assets } from '../assets/assets'
import { useCards } from '../context/CardContext'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { navigate } = useCards()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-gray-100 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={assets.logo}
            alt="LeoLearn Logo"
            className="w-32 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Nav Links */}
        <ul className="hidden sm:flex gap-6">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5  rounded-lg font-semibold transition-all duration-300
                ${isActive
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600]' : 'hover:bg-gray-100 shadow-[0_0_10px_bg-black]'}`
              }
            >
              <BookOpen className="h-4 w-4" />
              Decks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/study"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all duration-300
                ${isActive
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600]' : 'hover:bg-gray-100 shadow-[0_0_10px_bg-black]'}`
              }
            >
              <Brain className="h-4 w-4" />
              Study
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all duration-300
                ${isActive
                  ? 'bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600]' : 'hover:bg-gray-100 shadow-[0_0_10px_bg-black]'
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              Progress
            </NavLink>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center px-3 py-2 "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="flex flex-col text-left">
                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  Decks
                </NavLink>
                <NavLink
                  to="/study"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  Study
                </NavLink>
                <NavLink
                  to="/progress"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  Progress
                </NavLink>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar