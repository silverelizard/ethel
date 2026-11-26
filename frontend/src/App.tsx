import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import BottlesPage from '@/components/bottles/BottlesPage'
import CategoriesPage from '@/components/categories/CategoriesPage'
import SubCategoriesPage from '@/components/subCategories/SubCategoriesPage'
import StoragePage from '@/components/storage/StoragePage'
import LoginPage from '@/components/auth/LoginPage'
import PublicBottlesPage from '@/components/public/PublicBottlesPage'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import { useSession } from '@/hooks/useAuth'

/** Visitors: read-only bottle list at /, sign-in at /login. */
function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicBottlesPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Admin pages (or a logged-out refresh of one) fall back to the public list. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

/** Signed-in admins: the full editing app. */
function AdminRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/bottles" replace />} />
        <Route path="/login" element={<Navigate to="/bottles" replace />} />
        <Route path="/bottles" element={<BottlesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/sub-categories" element={<SubCategoriesPage />} />
        <Route path="/storage" element={<StoragePage />} />
        <Route path="*" element={<Navigate to="/bottles" replace />} />
      </Routes>
    </AppShell>
  )
}

function App() {
  const { isAuthenticated, isLoading, error } = useSession()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message="Could not reach the server." />

  return (
    <BrowserRouter>{isAuthenticated ? <AdminRoutes /> : <PublicRoutes />}</BrowserRouter>
  )
}

export default App
