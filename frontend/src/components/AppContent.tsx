import { useAuth } from '../contexts/AuthContext';
import { AuthScreen } from './auth/AuthScreen';
import { Dashboard } from './dashboard/Dashboard';
import { AcceptInviteScreen } from './auth/AcceptInviteScreen';
import { useInviteToken } from '../hooks/useInviteToken';

export const AppContent = () => {
  const { currentUser } = useAuth();
  const { inviteToken, clearInviteToken } = useInviteToken();

  if (inviteToken) {
    return <AcceptInviteScreen token={inviteToken} onComplete={clearInviteToken} />;
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  return <Dashboard />;
};
