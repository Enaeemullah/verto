import { AuthProvider } from './contexts/AuthContext';
import { ReleasesProvider } from './contexts/ReleasesContext';
import { AppContent } from './components/AppContent';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { ToastProvider } from './contexts/ToastContext';

const App = () => (
  <AuthProvider>
    <ReleasesProvider>
      <TransactionsProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </TransactionsProvider>
    </ReleasesProvider>
  </AuthProvider>
);

export default App;
