'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface UserWithRole extends User {
  role?: string;
}

export function useUser() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (authUser) {
          // The active role is already in the JWT token's role field
          // This is the current active role set by the backend /auth/v1/token or /auth/v1/switch-role
          const role = (authUser as unknown as { role?: string }).role || '';

          setUser({ ...authUser, role });
        } else {
          setUser(null);
        }
      } catch {
        // Error fetching user or profile - return null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // The active role is already in the JWT token's role field
        const role = (session.user as unknown as { role?: string }).role || '';

        setUser({ ...session.user, role });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
}
