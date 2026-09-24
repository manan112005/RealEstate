import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;