import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { IvrFlowListPage } from './pages/IvrFlowListPage';
import { IvrFlowBuilderPage } from './pages/IvrFlowBuilderPage';
import { LiveDashboardPage } from './pages/LiveDashboardPage';
import { CallLogsPage } from './pages/CallLogsPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MainContentLayout } from './components/layout/MainContentLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <div>Welcome to FonaBot</div>
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <div>Dashboard</div>
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/flows"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <IvrFlowListPage />
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/flows/:flowId/builder"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <IvrFlowBuilderPage />
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <LiveDashboardPage />
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/call-logs"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <CallLogsPage />
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Sidebar />
                  <MainContentLayout>
                    <div>Settings</div>
                  </MainContentLayout>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;