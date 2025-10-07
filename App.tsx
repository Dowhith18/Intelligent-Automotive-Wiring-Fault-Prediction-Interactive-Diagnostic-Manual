import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import NewDiagnosticSession from './pages/NewDiagnosticSession';
import Analysis from './pages/Analysis';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <div className="dark">
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="diagnostics" replace />} />
            <Route path="diagnostics" element={<NewDiagnosticSession />} />
            <Route path="diagnostics/:sessionId/analysis" element={<Analysis />} />
          </Route>

          <Route path="/" element={<Navigate to="/app" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;