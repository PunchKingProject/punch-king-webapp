import type { SideNavItem } from "../components/nav/SideNav.tsx";
import ROUTES from "../routes/routePath.ts";

export const ADMIN_SIDENAV_ITEMS: SideNavItem[] = [
  { label: 'Teams', to: ROUTES.TEAMS },
  { label: 'Users', to: ROUTES.USERS },
  { label: 'Licensing', to: ROUTES.LICENSING },
  { label: 'Subscription', to: ROUTES.SUBSCRIPTION },
  { label: 'Sponsorships', to: ROUTES.SPONSORSHIP },
];


export const TEAM_SIDENAV_ITEMS: SideNavItem[] = [
  { label: 'Catalogue', to: ROUTES.CATALOGUE },
  { label: 'My Subscriptions', to: ROUTES.MY_SUBSCRIPTIONS },
  { label: 'My Licensing', to: ROUTES.MY_LICENSING },
  { label: 'My Sponsorship', to: ROUTES.MY_SPONSORSHIP },
  { label: 'Inbox', to: ROUTES.INBOX },
];

export const USER_SIDENAV_ITEMS = [
  { label: 'My Sponsorships', to: ROUTES.USER_MY_SPONSORSHIPS },
  { label: 'Inbox', to: ROUTES.USER_INBOX },
];