import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { Organization, OrganizationInput } from '../types/organizations';
import { createOrganizationRequest, fetchOrganizations } from '../services/api';

interface OrganizationsContextValue {
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createOrganization: (input: OrganizationInput) => Promise<void>;
}

const OrganizationsContext = createContext<OrganizationsContextValue | undefined>(undefined);

export const useOrganizations = () => {
  const context = useContext(OrganizationsContext);
  if (!context) {
    throw new Error('useOrganizations must be used within OrganizationsProvider');
  }

  return context;
};

interface OrganizationsProviderProps {
  children: ReactNode;
}

export const OrganizationsProvider = ({ children }: OrganizationsProviderProps) => {
  const { token } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error('You must be signed in to manage organizations.');
    }

    return token;
  }, [token]);

  const loadOrganizations = useCallback(async () => {
    const authToken = ensureToken();
    return fetchOrganizations(authToken);
  }, [ensureToken]);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      setOrganizations([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    loadOrganizations()
      .then((data) => {
        if (isMounted) {
          setOrganizations(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load organizations.');
          setOrganizations([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, loadOrganizations]);

  const refresh = useCallback(async () => {
    const data = await loadOrganizations();
    setOrganizations(data);
  }, [loadOrganizations]);

  const createOrganization = useCallback(
    async (input: OrganizationInput) => {
      const authToken = ensureToken();
      await createOrganizationRequest(authToken, input);
      await refresh();
    },
    [ensureToken, refresh],
  );

  const value = useMemo(
    () => ({
      organizations,
      isLoading,
      error,
      refresh,
      createOrganization,
    }),
    [organizations, isLoading, error, refresh, createOrganization],
  );

  return <OrganizationsContext.Provider value={value}>{children}</OrganizationsContext.Provider>;
};
