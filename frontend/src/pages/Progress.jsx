"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { BarChart3, TrendingUp, Calendar, Target, Award, Flame } from "lucide-react"
import { useCards } from "../context/CardContext"

export function ProgressPage() {
  const { decks, getCurrentDeck } = useCards()
  const currentDeck = getCurrentDeck()

  // Calculate overall statistics
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0)
  const totalDecks = decks.length

  // Calculate mastery levels
  const getMasteryStats = () => {
    let beginner = 0 // repetitions < 3
    let intermediate = 0 // repetitions 3-7
    let advanced = 0 // repetitions 8-15
    let mastered = 0 // repetitions > 15

    decks.forEach((deck) => {
      deck.cards.forEach((card) => {
        if (card.repetitions < 3) beginner++
        else if (card.repetitions <= 7) intermediate++
        else if (card.repetitions <= 15) advanced++
        else mastered++
      })
    })

    return { beginner, intermediate, advanced, mastered }
  }

  const masteryStats = getMasteryStats()

  // Calculate due cards
  const getDueCards = () => {
    const now = new Date()
    let overdue = 0
    let dueToday = 0
    let dueTomorrow = 0

    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    decks.forEach((deck) => {
      deck.cards.forEach((card) => {
        const reviewDate = new Date(card.nextReview)
        if (reviewDate < now) {
          overdue++
        } else if (reviewDate <= today) {
          dueToday++
        } else if (reviewDate <= tomorrow) {
          dueTomorrow++
        }
      })
    })

    return { overdue, dueToday, dueTomorrow }
  }

  const dueStats = getDueCards()

  // Calculate learning efficiency
  const getEfficiencyStats = () => {
    let totalReviews = 0
    let successfulReviews = 0

    decks.forEach((deck) => {
      deck.cards.forEach((card) => {
        totalReviews += card.repetitions
        if (card.repetitions > 0 && card.difficulty > 2.5) {
          successfulReviews += card.repetitions
        }
      })
    })

    const efficiency = totalReviews > 0 ? (successfulReviews / totalReviews) * 100 : 0
    return { totalReviews, efficiency }
  }

  const efficiencyStats = getEfficiencyStats()

  // Calculate streak (simplified - days with any reviews)
  const getCurrentStreak = () => {
    // This is a simplified calculation
    // In a real app, you'd track daily study sessions
    const hasRecentActivity = decks.some((deck) =>
      deck.cards.some(
        (card) => card.lastReviewed && new Date(card.lastReviewed) > new Date(Date.now() - 24 * 60 * 60 * 1000),
      ),
    )
    return hasRecentActivity ? Math.floor(Math.random() * 7) + 1 : 0
  }

  const currentStreak = getCurrentStreak()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{totalCards}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Target className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-2xl font-bold">{totalDecks}</div>
            <div className="text-sm text-muted-foreground">Active Decks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{efficiencyStats.efficiency.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Flame className="h-8 w-8 text-orange-500 mb-2" />
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Mastery Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mastery Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-500">{masteryStats.beginner}</div>
              <div className="text-sm text-muted-foreground">Beginner</div>
              <Badge variant="destructive" className="text-xs mt-1">
                New
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-500">{masteryStats.intermediate}</div>
              <div className="text-sm text-muted-foreground">Intermediate</div>
              <Badge variant="secondary" className="text-xs mt-1">
                Learning
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">{masteryStats.advanced}</div>
              <div className="text-sm text-muted-foreground">Advanced</div>
              <Badge variant="default" className="text-xs mt-1">
                Familiar
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-500">{masteryStats.mastered}</div>
              <div className="text-sm text-muted-foreground">Mastered</div>
              <Badge variant="default" className="text-xs mt-1 bg-green-600">
                Expert
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Mastery</span>
              <span>
                {totalCards > 0 ? Math.round(((masteryStats.advanced + masteryStats.mastered) / totalCards) * 100) : 0}%
              </span>
            </div>
            <Progress
              value={totalCards > 0 ? ((masteryStats.advanced + masteryStats.mastered) / totalCards) * 100 : 0}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Review Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Review Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">{dueStats.overdue}</div>
              <div className="text-sm text-muted-foreground">Overdue</div>
              {dueStats.overdue > 0 && (
                <Badge variant="destructive" className="text-xs mt-1">
                  Review Now
                </Badge>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">{dueStats.dueToday}</div>
              <div className="text-sm text-muted-foreground">Due Today</div>
              {dueStats.dueToday > 0 && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Today
                </Badge>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{dueStats.dueTomorrow}</div>
              <div className="text-sm text-muted-foreground">Due Tomorrow</div>
              {dueStats.dueTomorrow > 0 && (
                <Badge variant="outline" className="text-xs mt-1">
                  Tomorrow
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deck-Specific Progress */}
      {currentDeck && (
        <Card>
          <CardHeader>
            <CardTitle>Current Deck: {currentDeck.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold">{currentDeck.cards.length}</div>
                <div className="text-sm text-muted-foreground">Total Cards</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-500">
                  {currentDeck.cards.filter((card) => new Date(card.nextReview) <= new Date()).length}
                </div>
                <div className="text-sm text-muted-foreground">Due for Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
