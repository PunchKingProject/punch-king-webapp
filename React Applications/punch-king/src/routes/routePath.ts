const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  PASSWORD_CHANGE: '/password-change',
  TERMS: '/terms',

  // Admin
  ADMIN: '/admin',
  TEAMS: '/admin/teams',
  USERS: '/admin/users',
  LICENSING: '/admin/licensing',
  SUBSCRIPTION: '/admin/subscription',
  SPONSORSHIP: '/admin/sponsorship',

  // Team
  TEAM: '/team',
  CATALOGUE: '/team/catalogue',
  MY_SUBSCRIPTIONS: '/team/my-subscriptions',
  TEAM_SUBSCRIPTION_PAYMENT: '/team/my-subscriptions/payment',

  MY_LICENSING: '/team/my-licensing',
  USER_LICENSE_PAYMENT: '/team/my-licensing/payments',
  MY_SPONSORSHIP: '/team/my-sponsorship',
  TEAM_MYSPONSORSHIP_DETAILS: '/team/my-sponsorship/details/:sponsorId',
  INBOX: '/team/inbox',

  // USER
  USER: '/user',
  USER_MY_SPONSORSHIPS: '/user/my-sponsorships',
  USER_INBOX: '/user/inbox',
  CATALOGUE_UPLOAD: '/team/catalogue/upload',
  USER_BUY_SPONSORS: '/user/my-sponsorships/buy-sponsors',

  // Admin Details
  TEAMS_DETAILS: '/admin/teams/details/:teamId',
  USERS_DETAILS: '/admin/users/details/:sponsor_id',
  LICENSING_DETAILS: '/admin/licensing/details/:team_id',
  SUBSCRIPTION_DETAILS: '/admin/subscription/details/:team_id',
  SPONSORSHIP_DETAILS: '/admin/sponsorship/details/:sponsor_id',
};

export default ROUTES