"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Eye, CheckCircle, ArrowLeft } from "lucide-react"
import { useCards } from "../context/CardContext"

export function StudySession({ onComplete }) {
  const { getCardsForReview, reviewCard, getCurrentDeck } = useCards()
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    completed: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  })

  // --- SRS helpers (match backend logic) ---
const EASY_BONUS = 1.30;      // rating=4 multiplier
const VERY_EASY_BONUS = 1.50; // rating=5 multiplier (kept for parity)
const HARD_SAME_DAY = 0.007;   // rating=1 → 10 minutes

function base1(rate) {
  switch (rate) {
    case 1: return HARD_SAME_DAY; // ~12h
    case 2: return 1.0;           // next day
    case 3: return 2.0;           // good
    case 4: return 3.0;           // easy
    case 5: return 5.0;           // very easy
    default: return 1.0;
  }
}

function base2(rate) {
  switch (rate) {
    case 1: return HARD_SAME_DAY; // ~12h again
    case 2: return 2.0;           // 2 days
    case 3: return 6.0;           // good
    case 4: return 8.0;           // easy
    case 5: return 12.0;          // very easy
    default: return 6.0;
  }
}

function formatInterval(days) {
  if (days < 1) {
    const hours = Math.round(days * 24);
    if (hours < 1) {
      const minutes = Math.max(1, Math.round(days * 24 * 60));
      return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    }
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  if (days < 30) {
    const whole = Math.round(days);
    return `${whole} day${whole === 1 ? "" : "s"}`;
  }
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"}`;
}


  const currentDeck = getCurrentDeck()

  useEffect(() => {
    const reviewCards = getCardsForReview()
    console.log("Review Cards:", reviewCards);
    
    setCards(reviewCards)
    setSessionStats((prev) => ({ ...prev, total: reviewCards.length }))
  }, [])

  if (!currentDeck) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Please select a deck first.</p>
        </CardContent>
      </Card>
    )
  }

  if (cards.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Great job!</h3>
            <p className="text-muted-foreground">No cards are due for review right now.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Come back later or add more cards to continue studying.
            </p>
          </div>
          <Button onClick={onComplete}>Back to Cards</Button>
        </CardContent>
      </Card>
    )
  }

  const currentCard = cards[currentCardIndex]
  const progress = (sessionStats.completed / sessionStats.total) * 100

  const handleAnswer = async (quality) => {
    if (!currentCard) return;
    await reviewCard(currentCard.id, quality);
  
    setSessionStats((prev) => ({
      ...prev,
      completed: prev.completed + 1,
      again: quality === 1 ? prev.again + 1 : prev.again,
      hard: quality === 2 ? prev.hard + 1 : prev.hard,
      good: quality === 3 ? prev.good + 1 : prev.good,
      easy: quality === 4 ? prev.easy + 1 : prev.easy,
    }));
  
    const updatedCards = cards.filter((_, idx) => idx !== currentCardIndex);
    
    setCards(updatedCards);
  
    if (updatedCards.length > 0) {
      setCurrentCardIndex(Math.min(currentCardIndex, updatedCards.length - 1));
    } else {
      onComplete();
    }
  
    setShowAnswer(false);
  };

  // --- Updated predictTime ---
const predictTime = (quality) => {
  const ef = currentCard && currentCard.easeFactor ? currentCard.easeFactor : 2.5;
  const reps = currentCard && (currentCard.repetitions || currentCard.repititions) || 0;
  const lastIntervalDays = Math.max(0, currentCard && currentCard.reviewIntervalDays || 0);

  let intervalDays;

  switch (quality) {
    case 1: // Very hard / Again
      intervalDays = base1(1); // ~12h
      break;

    case 2: // Hard
      intervalDays = base1(2); // 1 day
      break;

    case 3: // Good
      if (reps === 0) {
        intervalDays = base1(3);
      } else if (reps === 1) {
        intervalDays = base2(3);
      } else {
        intervalDays = Math.max(1, ef * Math.max(1, lastIntervalDays));
      }
      break;

    case 4: // Easy
      if (reps === 0) {
        intervalDays = base1(4);
      } else if (reps === 1) {
        intervalDays = base2(4);
      } else {
        intervalDays = Math.max(1, ef * EASY_BONUS * Math.max(1, lastIntervalDays));
      }
      break;

    default: // treat anything else as "good"
      if (reps === 0) {
        intervalDays = base1(3);
      } else if (reps === 1) {
        intervalDays = base2(3);
      } else {
        intervalDays = Math.max(1, ef * Math.max(1, lastIntervalDays));
      }
      break;
  }

  return formatInterval(intervalDays);
};
  

  return (
    <div className="space-y-6">

      <div className="flex justify-start mt-4">
        <Button 
          onClick={onComplete} 
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2">
          <ArrowLeft className="h-5 w-5" />
          Exit
        </Button>
      </div>


      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>
            {sessionStats.completed} / {sessionStats.total}
          </span>
        </div>
        {/* <div className="w-full max-w-lg mx-auto"> Add a container with a max width */}
          <Progress value={progress} className="w-full" />
        {/* </div> */}
      </div>

      {/* Current Card */}
      <Card className="w-full max-w-2xl mx-auto">
        {/* <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{showAnswer ? "Answer" : "Question"}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Card {currentCardIndex + 1} of {cards.length}
              </Badge>
            </div>
          </div>
        </CardHeader> */}
        <CardContent className="space-y-6">
        <div
  className={
    `min-h-[300px] p-4 ` +
    (showAnswer
      ? `grid place-items-center grid-rows-[1fr_auto_1fr]`
      : `flex items-center justify-center`)
  }
>
  
<div className="w-full text-lg text-center whitespace-pre-wrap">
    {currentCard.front}
    {currentCard.frontImage && (
      <img
        src={currentCard.frontImage}
        alt="front"
        className="mx-auto mt-4 max-h-48 object-contain"
      />
    )}
  </div>

  {showAnswer && (
    <>
      {/* Divider sized by container, not text */}
      <div className="w-2/3 sm:w-1/2 h-px bg-black my-4" />
      {/* or: <div className="w-[60%] h-px bg-border my-4" /> */}

      <div className="w-full text-lg text-center whitespace-pre-wrap">
        {currentCard.back}
        {currentCard.backImage && (
          <img
            src={currentCard.backImage}
            alt="back"
            className="mx-auto mt-4 max-h-48 object-contain"
          />
        )}
      </div>
    </>
  )}
</div>
          

          
        </CardContent>
      
      </Card>
      {!showAnswer ? (
            <div className="flex justify-center">
              <Button onClick={() => setShowAnswer(true)} className="flex items-center text-white gap-2 bg-blue-500 hover:bg-blue-600">
                <Eye className="h-4 w-4 " />
                Show Answer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">How well did you know this answer?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleAnswer(1)}
                  className="flex flex-col gap-1 h-auto py-3 bg-red-500 hover:bg-red-600"
                >
                  <span className="font-semibold">Again</span>
                  <span className="text-xs opacity-90">{predictTime(1)}</span>
                </Button>
                <Button variant="secondary" onClick={() => handleAnswer(2)} className="flex flex-col gap-1 h-auto py-3 bg-yellow-300 hover:bg-yellow-400">
                  <span className="font-semibold">Hard</span>
                  <span className="text-xs opacity-90">{predictTime(2)}</span>
                </Button>
                <Button variant="default" onClick={() => handleAnswer(3)} className="flex flex-col gap-1 h-auto py-3 bg-blue-500 hover:bg-blue-600">
                  <span className="font-semibold">Good</span>
                  <span className="text-xs opacity-90">{predictTime(3)}</span>
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleAnswer(4)}
                  className="flex flex-col gap-1 h-auto py-3 bg-green-600 hover:bg-green-700"
                >
                  <span className="font-semibold">Easy</span>
                  <span className="text-xs opacity-90">{predictTime(4)}</span>
                </Button>
              </div>
            </div>
          )}

      {/* Session Stats */}
      {sessionStats.completed > 0 && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Session Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-500">{sessionStats.again}</div>
                <div className="text-xs text-muted-foreground">Again</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{sessionStats.hard}</div>
                <div className="text-xs text-muted-foreground">Hard</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{sessionStats.good}</div>
                <div className="text-xs text-muted-foreground">Good</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{sessionStats.easy}</div>
                <div className="text-xs text-muted-foreground">Easy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
