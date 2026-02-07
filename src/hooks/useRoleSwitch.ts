'use client';

import { useState, useCallback } from 'react';
import { switchRole } from '@/actions/auth/switchRole';
import { createClient } from '@/lib/supabase/client';

import { useToast } from '@/components/common';

export function useRoleSwitch() {
  const [isSwitching, setIsSwitching] = useState(false);
   const supabase = createClient(undefined, undefined, true); 
  const toast = useToast();

  const handleSwitchRole = useCallback(
    async (newRole: string) => {
      try {
        setIsSwitching(true);

        // Get session to retrieve refresh_token
        // Try getSession first (fast, uses cached session)
        let session = (await supabase.auth.getSession()).data.session;

        // If no session found, try getUser (validates with server)
        if (!session) {
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (!error && user) {
            // Refresh session after user validation
            session = (await supabase.auth.getSession()).data.session;
          }
        }

        if (!session || !session.refresh_token) {
          toast.error('Unable to retrieve session', 'Session Error');
          setIsSwitching(false);
          return;
        }

        // Call switch role API with role and refresh_token
        const response = await switchRole({
          role: newRole,
          refresh_token: session.refresh_token,
        });

        if (response.success && response.access_token && response.refresh_token) {
          // Show success message immediately (before setSession which might fail)
          toast.success(
            `Successfully switched to ${newRole.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
            'Role Switched'
          );

          // Try to set session, but don't block on failure
          // The page reload will pick up the new tokens from the backend
          try {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: response.access_token,
              refresh_token: response.refresh_token,
            });

            if (setSessionError) {
              console.warn('Warning: Could not set session immediately:', setSessionError);
              console.warn('This is OK - the page reload will authenticate with new role');
              // Don't return or show error - just log and continue with reload
            } else {
              console.log('Session updated successfully');
            }
          } catch (setSessionException) {
            console.warn('Exception setting session:', setSessionException);
            console.warn('This is OK - the page reload will authenticate with new role');
            // Don't return or show error - just log and continue with reload
          }

          // Reload the page to apply new role
          // On reload, the backend will provide correct tokens for the new role
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 500);
        } else {
          toast.error(
            response.message || 'Failed to switch role',
            'Role Switch Failed'
          );
          setIsSwitching(false);
        }
      } catch (error) {
        console.error('Role switch error:', error);
        toast.error(
          error instanceof Error ? error.message : 'An error occurred while switching roles',
          'Role Switch Error'
        );
        setIsSwitching(false);
      }
    },
    [supabase, toast]
  );

  return {
    handleSwitchRole,
    isSwitching,
  };
}
