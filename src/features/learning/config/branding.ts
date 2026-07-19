/**
 * Shared branding configuration for learning pages.
 * Centralizes navigation, social links, and branding elements
 * to maintain consistency and make updates easier.
 */

export interface NavLink {
  label: string;
  href: string;
  disabled?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  disabled?: boolean;
}

export const BRANDING = {
  app: {
    name: "interview.lab",
    url: "/",
 },
  navigation: {
    menu: {
      label: "Menu",
      // TODO: Add actual menu href when menu is implemented
      href: "#",
      disabled: true,
    },
  },
  social: {
    facebook: {
      label: "Facebook",
      href: "#",
      disabled: true,
    },
    twitter: {
      label: "Twitter", 
      href: "#",
      disabled: true,
    },
  },
} as const;

export const getSocialLinks = (): SocialLink[] => [
  { ...BRANDING.social.facebook },
  { ...BRANDING.social.twitter },
];

export const getNavigationLinks = (): NavLink[] => [
  { ...BRANDING.navigation.menu },
];
