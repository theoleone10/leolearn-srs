"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import { CardProvider } from "../context/CardContext.jsx"
import { CardsPage } from "../pages/cards-page.jsx"
import { StudyPage } from "../pages/study-page.jsx"
import { ProgressPage } from "../pages/progress-page.jsx"
import { BookOpen, Brain, BarChart3 } from "lucide-react"

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SpaceRep</h1>
          <p className="text-lg text-gray-600">Master anything with spaced repetition</p>
        </div>

        <Tabs defaultValue="cards" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Study
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <CardsPage />
          </TabsContent>

          <TabsContent value="study">
            <StudyPage />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressPage />
          </TabsContent>
        </Tabs>
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
