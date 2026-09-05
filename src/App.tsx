import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'serious-component-library'
import { CreateGoal } from './pages/CreateGoal'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HtmlThemeSync } from './components/HtmlThemeSync'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <HtmlThemeSync />
      <Header />
      <Routes>
        <Route path="/" element={<CreateGoal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  )
}

export default App
