import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'serious-component-library'
import { CreateGoal } from './pages/CreateGoal'
import { GoalBingo } from './pages/GoalBingo'
import { Footer } from './components/Footer'
import { HtmlThemeSync } from './components/HtmlThemeSync'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <HtmlThemeSync />
      <Routes>
        <Route path="/" element={<CreateGoal />} />
        {/* Not linked from anywhere in the UI, reachable only by navigating here directly. */}
        <Route path="/bingo" element={<GoalBingo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  )
}

export default App
