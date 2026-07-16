export const ROUTES = {
  HOME: "/",
  LEARN: "/learn",
  LIBRARY: "/library",

  interview(id: string) {
    return `/interview/${id}`;
  },

  transcript(slug: string) {
    return `/library/${slug}`;
  },

  diagram(system: string) {
    return `/learn/diagrams/${system}`;
  },

  problem(slug: string) {
    return `/problems/${slug}`;
  },
} as const;