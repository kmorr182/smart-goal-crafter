import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'serious-component-library'
import { CreateGoal } from './pages/CreateGoal'
import { Footer } from './components/Footer'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Routes>
        <Route path="/" element={<CreateGoal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  )
}

export default App
