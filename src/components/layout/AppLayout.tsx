'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';
import clsx from 'clsx';
import { useAppStore } from '@/lib/providers/ClientStateProvider';
import {
  selectMobileSidebarActive,
  selectNavigationGuard,
  selectSidebarCollapsed,
  selectFullscreenMode,
} from '@/state';
import Image from 'next/image';
import { Avatar } from '../misc';
import { formatToTitleCase } from '@/utils/formatters';
import { useRoleSwitch } from '@/hooks/useRoleSwitch';
import { ProgressSpinner } from 'primereact/progressspinner';
import { PageHeader } from './PageHeader';
import { APP_LEARNING_CATALOGUE } from '@/constants';
import { useLogout } from '@/modules/auth/hooks/useLogout';
import { LogoutConfirmationModal } from '@/modules/auth/components/LogoutConfirmationModal';
import { NotificationBell } from '@/modules/notification/components/NotificationBell';
import { NotificationPermissionPrompt } from '@/modules/notification/components/NotificationPermissionPrompt';
import { useACL } from '@/hooks/useACL';
import { useUserProfile } from '@/modules/profile/hooks/useUserProfile';
import { getAvatarProxiedUrl } from '@/lib/utils/avatar-url';
import type { Role } from '@/types/acl';
// ThemeToggle hidden until dark mode is fully implemented
// import { ThemeToggle } from './ThemeToggle';

type LayoutMenuItem = {
  label: string;
  icon: string;
  href: string;
  badge?: string;
  /** Feature identifier for ACL checking */
  feature?: string;
  /** Roles that can access this menu item */
  allowedRoles?: Role[];
};

interface AppLayoutProps {
  user: User | null;
  children: ReactNode;
  menuItems?: LayoutMenuItem[];
  topbarTitle?: string;
}

export const AppLayout = ({
  menuItems,
  children,
  user,
  topbarTitle = 'Learning Management System',
}: AppLayoutProps) => {
  const sidebarCollapsed = useAppStore(selectSidebarCollapsed);
  const mobileSidebarActive = useAppStore(selectMobileSidebarActive);
  const navigationGuard = useAppStore(selectNavigationGuard);
  const fullscreenMode = useAppStore(selectFullscreenMode);
  const setPendingRoute = useAppStore((state) => state.setPendingRoute);
  const toggleSidebarCollapsed = useAppStore(
    (state) => state.toggleSidebarCollapsed
  );
  const toggleMobileSidebar = useAppStore((state) => state.toggleMobileSidebar);
  const closeMobileSidebar = useAppStore((state) => state.closeMobileSidebar);

  const menuRef = useRef<Menu>(null);
  const router = useRouter();
  const { handleSwitchRole, isSwitching } = useRoleSwitch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use logout hook for modal-based logout flow
  const {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    handleLogout: performLogout,
  } = useLogout();

  const pathname = usePathname();

  // Use ACL hook for permission checking (currently only used for future permission-based filtering)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { canAccess, isLoading: aclLoading } = useACL();

  // Fetch user profile to get avatar from user-attributes table
  const { profile } = useUserProfile();

  // Get user display info
  const userName = useMemo(() => {
    if (!user) return 'User';
    return (
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'User'
    );
  }, [user]);

  const userRole = useMemo(() => {
    return user?.role ? formatToTitleCase(user.role) : '-';
  }, [user]);

  // Get avatar from profile (user-attributes) first, fallback to auth user_metadata
  const userAvatar = useMemo(() => {
    // Priority 1: Avatar from user-attributes (via profile API)
    if (profile?.basicInfo?.avatar) {
      return profile.basicInfo.avatar;
    }
    // Priority 2: Avatar from Supabase Auth user_metadata (fallback)
    const avatarPath =
      user?.user_metadata?.avatar_url || user?.user_metadata?.avatar;
    return getAvatarProxiedUrl(avatarPath);
  }, [profile, user]);

  // Get assigned roles from app_metadata
  const assignedRoles = useMemo(() => {
    const roles = user?.app_metadata?.assigned_roles;
    if (!roles || !Array.isArray(roles)) return [];
    return roles;
  }, [user]);

  // Get current role from user prop (this is the active role from JWT)
  const currentRole = useMemo(() => {
    return user?.role || user?.app_metadata?.role || assignedRoles[0] || '';
  }, [user, assignedRoles]);

  // Check if user has a specific role (uses user prop directly, not useACL)
  const checkUserRole = useCallback(
    (allowedRoles: Role[]): boolean => {
      if (!currentRole) return false;
      return allowedRoles.includes(currentRole as Role);
    },
    [currentRole]
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const items = useMemo<LayoutMenuItem[]>(
    () =>
      menuItems ?? [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          href: '/dashboard',
          feature: 'dashboard',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
            'lecturer',
            'learner',
            'mentor',
            'reviewer',
          ] as Role[],
        },
        {
          label: 'Learning Catalog',
          icon: 'pi pi-book',
          href: APP_LEARNING_CATALOGUE,
          feature: 'learning-catalogue',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
          ] as Role[],
        },
        {
          label: 'My Courses',
          icon: 'pi pi-graduation-cap',
          href: '/learning-sessions',
          feature: 'learning-sessions',
          allowedRoles: ['learner'] as Role[],
        },
        {
          label: 'Course Management',
          icon: 'pi pi-desktop',
          href: '/course-management',
          feature: 'course-management',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
            'lecturer',
          ] as Role[],
        },
        {
          label: 'Learning Roadmaps',
          icon: 'pi pi-map-marker',
          href: '/learning-roadmap',
          feature: 'learning-roadmap',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
            'lecturer',
            'learner',
            'reviewer',
          ] as Role[],
        },
        {
          label: 'Calendar of Events',
          icon: 'pi pi-calendar',
          href: '/calendar-of-events',
          feature: 'calendar-of-events',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
            'lecturer',
            'learner',
            'reviewer',
            'mentor',
          ] as Role[],
        },
        {
          label: 'Mentoring',
          icon: 'pi pi-envelope',
          href: '/mentoring',
          feature: 'mentoring',
          allowedRoles: [
            'mentor',
          ] as Role[],
        },
        {
          label: 'Assessment & Feedback',
          icon: 'pi pi-pen-to-square',
          href: '/learning-assessment',
          feature: 'learning-assessment',
          allowedRoles: [
            'lecturer',
            'reviewer',
            'super_admin',
            'learning_organizer',
          ] as Role[],
        },
        {
          label: 'Report',
          icon: 'pi pi-chart-bar',
          href: '/report',
          feature: 'reports',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
          ] as Role[],
        },
        {
          label: 'Announcements',
          icon: 'pi pi-megaphone',
          href: '/announcements',
          feature: 'announcements',
          allowedRoles: [
            'super_admin',
            'learning_organizer',
            'lecturer',
            'learner',
            'mentor',
            'reviewer',
          ] as Role[],
        },
        {
          label: 'User Management',
          icon: 'pi pi-users',
          href: '/user-management',
          feature: 'user-management',
          allowedRoles: ['super_admin', 'learning_organizer'] as Role[],
        },
        {
          label: 'Setting',
          icon: 'pi pi-cog',
          href: '/settings',
          feature: 'settings',
          allowedRoles: ['super_admin', 'learning_organizer'] as Role[],
        },
      ],
    [menuItems]
  );

  // Filter menu items based on ACL (permissions + roles)
  const filteredItems = useMemo(() => {
    // If no user, show no items
    if (!user) return [];

    // While ACL is loading, filter by role only (using user prop directly)
    // This ensures menu is visible immediately after login
    return items.filter((item) => {
      // Check role restriction (uses user prop directly, not useACL)
      if (item.allowedRoles && item.allowedRoles.length > 0) {
        if (!checkUserRole(item.allowedRoles)) return false;
      }

      // Permission check is secondary - only check if feature is specified
      // Skip permission check while ACL is loading to avoid empty menu flash
      // When permissions API is fully implemented, uncomment this block:
      // if (!aclLoading && item.feature) {
      //   if (!canAccess(item.feature)) return false;
      // }

      return true;
    });
  }, [items, checkUserRole, user]);

  const profileMenuItems = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [];

    // Add role switching section if user has multiple roles
    if (assignedRoles.length > 1) {
      items.push({
        label: 'Switch Role',
        className: 'text-sm text-muted-foreground',
        disabled: true,
      });

      // Add each role as a menu item
      assignedRoles.forEach((role) => {
        items.push({
          label: `Login as ${formatToTitleCase(role)}`,
          icon: role === currentRole ? 'pi pi-check' : undefined,
          className:
            role === currentRole ? 'text-muted-foreground text-sm' : 'text-sm',
          disabled: isSwitching || role === currentRole,
          command: () => {
            setIsMenuOpen(false);
            handleSwitchRole(role);
          },
        });
      });

      items.push({
        separator: true,
      });
    }

    // Add profile and logout items
    items.push(
      {
        label: 'My Profile',
        className: 'text-sm',
        command: () => {
          setIsMenuOpen(false);
          router.push('/profile');
        },
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        className: 'text-sm text-danger',
        command: () => {
          setIsMenuOpen(false);
          openModal();
        },
      }
    );

    return items;
  }, [
    assignedRoles,
    currentRole,
    isSwitching,
    router,
    handleSwitchRole,
    openModal,
  ]);

  useEffect(() => {
    document.body.style.overflow = mobileSidebarActive ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarActive]);

  useEffect(() => {
    closeMobileSidebar();
  }, [closeMobileSidebar, pathname]);

  const wrapperClass = classNames('layout-wrapper', {
    'layout-sidebar-active': mobileSidebarActive,
    'layout-sidebar-collapsed': sidebarCollapsed,
    'layout-fullscreen': fullscreenMode,
  });

  const handleMobileMenuToggle = () => {
    toggleMobileSidebar();
  };

  const handleSidebarCollapseToggle = () => {
    if (window.innerWidth <= 991) {
      toggleMobileSidebar();
      return;
    }
    toggleSidebarCollapsed();
  };

  // Fullscreen mode: use CSS class instead of conditional render to prevent remounting children
  // The 'layout-fullscreen' class hides topbar, sidebar, and page header via CSS

  return (
    <div className={wrapperClass}>
      {/* Topbar */}
      <header className={clsx('layout-topbar')}>
        <div className={clsx('layout-topbar-left')}>
          <button
            type="button"
            className="p-link"
            onClick={handleSidebarCollapseToggle}
            aria-label="Toggle menu"
          >
            <i className="pi pi-bars text-xl" />
          </button>
        </div>

        <div className={clsx('layout-topbar-center')}>
          <h1 className="text-lg m-0">{topbarTitle}</h1>
        </div>

        <div className={clsx('layout-topbar-actions')}>
          {/* Notification Bell */}
          <NotificationBell user={user} />

          <button
            type="button"
            className="p-link flex items-center gap-2"
            onClick={(e) => {
              setIsMenuOpen(!isMenuOpen);
              menuRef.current?.toggle(e);
            }}
            aria-label="Profile menu"
            data-testid="layout-profile-menu-button"
            disabled={isSwitching}
          >
            {isSwitching ? (
              <ProgressSpinner
                style={{ width: '32px', height: '32px' }}
                strokeWidth="4"
                animationDuration="1s"
              />
            ) : userAvatar ? (
              <Avatar image={userAvatar} size="normal" shape="circle" />
            ) : (
              <Avatar
                label={getInitials(userName)}
                size="normal"
                shape="circle"
                style={{
                  backgroundColor: 'var(--theme-avatar-bg)',
                  color: 'var(--theme-avatar-text)',
                  fontSize: '12px',
                }}
              />
            )}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold">{userName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isSwitching ? 'Switching role...' : userRole}
              </span>
            </div>
            <i className="pi pi-angle-down text-xs hidden md:block font-normal" />
          </button>

          <Menu
            model={profileMenuItems}
            popup
            ref={menuRef}
            className="profile-menu"
            onHide={() => setIsMenuOpen(false)}
          />
        </div>
      </header>

      {/* Sidebar */}
      <aside className={clsx('layout-sidebar')}>
        <div className={clsx('flex items-center justify-center')}>
          <Image
            src={
              !sidebarCollapsed
                ? '/logo-dashboard.png'
                : '/logo-dashboard-small.png'
            }
            alt="Komatsu LMS"
            width={200}
            height={40}
            priority
            className={clsx('h-10 w-auto')}
          />
        </div>

        <div className={clsx('layout-sidebar-content')}>
          <section className={clsx('layout-sidebar-section')}>
            <nav className={clsx('layout-menu')}>
              <ul>
                {filteredItems.map((item) => {
                  const itemClass = classNames('layout-menuitem p-ripple', {
                    'layout-menuitem-active': pathname === item.href,
                  });

                  // Handle navigation with guard check
                  const handleNavigation = (e: React.MouseEvent) => {
                    // Check if there's a navigation guard and if it blocks navigation
                    if (navigationGuard && navigationGuard()) {
                      e.preventDefault();
                      // Store the pending route for the form to handle
                      setPendingRoute(item.href);
                      return;
                    }
                    // If no guard or guard allows navigation, let the Link handle it
                  };

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={itemClass}
                        onClick={handleNavigation}
                        data-testid={`sidebar-menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <i
                          className={classNames(
                            'layout-menuitem-icon',
                            item.icon
                          )}
                          aria-hidden
                        />
                        {!sidebarCollapsed && (
                          <>
                            <span className={clsx('layout-menuitem-label')}>
                              {item.label}
                            </span>
                            {item.badge ? (
                              <span className={clsx('layout-menuitem-badge')}>
                                {item.badge}
                              </span>
                            ) : null}
                          </>
                        )}
                        <Ripple />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </section>
        </div>

        {/* Theme Toggle - Hidden until dark mode is fully implemented
        <div className={clsx('layout-sidebar-footer')}>
          <ThemeToggle showLabel={!sidebarCollapsed} />
        </div>
        */}
      </aside>

      {/* Page Header - Fixed below topbar */}
      <PageHeader />

      {/* Main Content */}
      <div className={clsx('layout-main-container')}>
        <main className={clsx('layout-main')}>{children}</main>
      </div>

      <div
        className={clsx('layout-mask')}
        onClick={handleMobileMenuToggle}
        aria-hidden
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isOpen}
        isLoading={isLoading}
        onConfirm={performLogout}
        onDismiss={closeModal}
      />

      {/* Push Notification Permission Prompt */}
      <NotificationPermissionPrompt />
    </div>
  );
};
