import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MaintenanceListPage } from './pages/Maintenance/MaintenanceListPage'
import { MaintenanceFormPage } from './pages/Maintenance/MaintenanceFormPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/maintenance" element={<MaintenanceListPage />} />
        <Route path="/maintenance/new" element={<MaintenanceFormPage />} />
        <Route path="/maintenance/:id/edit" element={<MaintenanceFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
