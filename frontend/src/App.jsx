import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ClientLayout from './components/ClientLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RulesPage from './pages/RulesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClientLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <ChallengesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/" element={<Navigate to="/challenges" replace />} />
            <Route path="*" element={<Navigate to="/challenges" replace />} />
          </Routes>
        </ClientLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
