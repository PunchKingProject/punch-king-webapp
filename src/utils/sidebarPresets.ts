import type { SideNavItem } from '../components/nav/SideNav.tsx';
import ROUTES from '../routes/routePath.ts';

export const ADMIN_SIDENAV_ITEMS: SideNavItem[] = [
  { label: 'Dashboard', to: ROUTES.ADMIN },
  { label: 'Teams', to: ROUTES.TEAMS },
  { label: 'Users', to: ROUTES.USERS },
  { label: 'Team Posts', to: '/admin/team-posts' },
  { label: 'News & Events', to: '/admin/news-events' },
  { label: 'Licensing', to: ROUTES.LICENSING },
  { label: 'Subscriptions', to: ROUTES.SUBSCRIPTION },
  { label: 'Sponsorships', to: ROUTES.SPONSORSHIP },
  { label: 'Inbox', to: '/admin/inbox' },
  { label: 'Profile', to: '/admin/profile' },
  { label: 'Security', to: '/admin/security' },
];

export const TEAM_SIDENAV_ITEMS: SideNavItem[] = [
  { label: 'Dashboard', to: ROUTES.TEAM },
  { label: 'Catalogue', to: ROUTES.CATALOGUE },
  { label: 'Upload Media', to: '/team/catalogue/upload' },
  { label: 'My Subscriptions', to: ROUTES.MY_SUBSCRIPTIONS },
  { label: 'My Licensing', to: ROUTES.MY_LICENSING },
  { label: 'My Sponsorship', to: ROUTES.MY_SPONSORSHIP },
  { label: 'Inbox', to: ROUTES.INBOX },
  { label: 'Profile', to: '/team/profile' },
  { label: 'Security', to: '/team/security' },
];

export const USER_SIDENAV_ITEMS: SideNavItem[] = [
  { label: 'Dashboard', to: ROUTES.USER },
  { label: 'Explore Fighters', to: '/weight-class/welterweight' },
  { label: 'My Sponsorships', to: ROUTES.USER_MY_SPONSORSHIPS },
  { label: 'Buy Sponsorship Points', to: '/user/my-sponsorships/buy-sponsors' },
  { label: 'Inbox', to: ROUTES.USER_INBOX },
  { label: 'Profile', to: '/user/profile' },
  { label: 'Security', to: '/user/security' },
];