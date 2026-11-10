/** Static route composition aligned with the source-pinned Hygiene registry. */
export const intelligenceEndpointRoutes = [
  {
    id: "roadmap",
    path: "/roadmap/",
    aliases: ["/intelligence/roadmap/"],
    title: "Roadmap",
    question: "What is the declared intent, and what evidence supports the next step?",
  },
  {
    id: "decisions",
    path: "/decisions/",
    aliases: ["/adr/", "/intelligence/decisions/"],
    title: "Decisions",
    question: "What was decided, by whose authority, and what implements it?",
  },
  {
    id: "dependencies",
    path: "/dependencies/",
    aliases: ["/intelligence/dependencies/"],
    title: "Dependencies",
    question: "What explicitly depends on or blocks what?",
  },
  {
    id: "health",
    path: "/health/",
    aliases: ["/intelligence/health/"],
    title: "Health",
    question: "What do the captured checks actually establish at this revision?",
  },
  {
    id: "releases",
    path: "/releases/",
    aliases: ["/intelligence/releases/"],
    title: "Releases",
    question: "What was published, and what deployment evidence is available?",
  },
  {
    id: "distribution",
    path: "/distribution/",
    aliases: ["/intelligence/distribution/"],
    title: "Distribution",
    question: "What can be obtained or installed, and what has been verified?",
  },
  {
    id: "sanity",
    path: "/sanity/",
    aliases: ["/intelligence/sanity/"],
    title: "Sanity",
    question: "What architecture-coherence conclusions have humans ratified?",
  },
  {
    id: "hygiene",
    path: "/hygiene/",
    aliases: ["/intelligence/hygiene/"],
    title: "Hygiene",
    question: "Which applicable contracts have supported conformance evidence?",
  },
  {
    id: "audits",
    path: "/audits/",
    aliases: ["/intelligence/audits/"],
    title: "Audits",
    question: "What audit findings exist, and what supports their disposition?",
  },
  {
    id: "status",
    path: "/status/",
    aliases: [],
    title: "Status",
    question: "What service or incident state has actually been observed?",
  },
  {
    id: "identity_intelligence",
    path: "/intelligence/identity/",
    aliases: [],
    title: "Identity Intelligence",
    question: "Which declared repository identities are supported by canonical sources?",
  },
  {
    id: "now",
    path: "/intelligence/now/",
    aliases: ["/now/"],
    title: "Now",
    question: "What needs attention at the current evidence boundary?",
  },
  {
    id: "journey",
    path: "/intelligence/journey/",
    aliases: ["/activity/", "/intelligence/activity/", "/journey/"],
    title: "Journey",
    question: "What observed events form this repository's history?",
  },
  {
    id: "work",
    path: "/intelligence/work/",
    aliases: ["/work/"],
    title: "Work",
    question: "Which issues, pull requests and declared queues are open?",
  },
  {
    id: "search",
    path: "/search/",
    aliases: ["/intelligence/search/"],
    title: "Search",
    question: "Which admitted evidence records match the normalized search representation?",
  },
  {
    id: "compare",
    path: "/intelligence/compare/",
    aliases: ["/compare/"],
    title: "Compare",
    question: "What changed between two compatible captured snapshots?",
  },
  {
    id: "diagnostics",
    path: "/intelligence/diagnostics/",
    aliases: ["/diagnostics/"],
    title: "Diagnostics",
    question: "What producer findings and collection failures need owner attention?",
  },
  {
    id: "dashboard",
    path: "/intelligence/dashboard/",
    aliases: ["/dashboard/"],
    title: "Intelligence Dashboard",
    question: "How do the available views, repositories and declared relationships connect?",
  },
] as const;
export type IntelligenceEndpointId = (typeof intelligenceEndpointRoutes)[number]["id"];
export function isIntelligencePath(path: string): boolean {
  return (
    path === "/intelligence/" || intelligenceEndpointRoutes.some((route) => route.path === path)
  );
}
export function intelligencePathFile(path: string): string {
  return path === "/" ? "index.html" : `${path.slice(1).replace(/\/$/, "")}/index.html`;
}
