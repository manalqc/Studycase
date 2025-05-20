// No React import needed with modern JSX transform
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyEventsPage from './pages/MyEventsPage';
import AdminEvents from './pages/admin/AdminEvents';
import EventEditor from './pages/admin/EventEditor';
import DebugPage from './pages/admin/DebugPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* User routes - protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-events" element={<MyEventsPage />} />
          </Route>
          
          {/* Admin routes - protected */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<AdminEvents />} />
            <Route path="/admin/events/new" element={<EventEditor />} />
            <Route path="/admin/events/edit/:id" element={<EventEditor />} />
            <Route path="/admin/debug" element={<DebugPage />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;