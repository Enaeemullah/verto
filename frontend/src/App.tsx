import { AuthProvider } from './contexts/AuthContext';
import { ReleasesProvider } from './contexts/ReleasesContext';
import { AppContent } from './components/AppContent';
import { TransactionsProvider } from './contexts/TransactionsContext';

const App = () => (
  <AuthProvider>
    <ReleasesProvider>
      <TransactionsProvider>
        <AppContent />
      </TransactionsProvider>
    </ReleasesProvider>
  </AuthProvider>
);

export default App;
