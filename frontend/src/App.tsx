import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import BottlesPage from '@/components/bottles/BottlesPage'
import CategoriesPage from '@/components/categories/CategoriesPage'
import SubCategoriesPage from '@/components/subCategories/SubCategoriesPage'
import StoragePage from '@/components/storage/StoragePage'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/bottles" replace />} />
          <Route path="/bottles" element={<BottlesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/sub-categories" element={<SubCategoriesPage />} />
          <Route path="/storage" element={<StoragePage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
