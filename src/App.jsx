import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewsArticle from './pages/NewsArticle'
import AdminLogin from './pages/admin/AdminLogin'
import AdminGuard from './pages/admin/AdminGuard'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminArticles from './pages/admin/AdminArticles'
import AdminArticlesEditor from './pages/admin/AdminArticlesEditor'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Console Routes */}
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/articles/new" element={<AdminArticlesEditor />} />
            <Route path="/admin/articles/edit/:id" element={<AdminArticlesEditor />} />
          </Route>
        </Route>
        
        {/* Fallback: redirect unknown paths to home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App