import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import CreateJobPage from './pages/CreateJobPage';
import EditJobPage from './pages/EditJobPage';




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
            } />
          
          <Route
            path="/"
            element={
             <Navigate to="/jobs" />
            }
          />
          
          <Route path="/register" element={
            <PublicRoute><RegisterPage /></PublicRoute>
            } />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/create"
            element={
              <ProtectedRoute>
                <CreateJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute>
                <EditJobPage />
              </ProtectedRoute>
            }
          />
           <Route path="*" element={<Navigate to="/jobs" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
