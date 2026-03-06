export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Pelada de Quarta APP",
  description: "Organização da pelada de quarta.",
  navItems: [
    {
      label: "Início",
      permission: ["default"],
      href: "/",
    },
    {
      label: "Partidas",
      permission: ["default"],
      href: "/matches",
    },
    {
      label: "Jogadores",
      permission: ["admin"],
      href: "/admin/players",
    },
    {
      label: "Checkins",
      permission: ["admin"],
      href: "admin/checkins",
    },
    {
      label: "Partidas",
      permission: ["admin"],
      href: "/admin/matches",
    },
  ],
  links: {
    github: "https://github.com/jeffexavier/futebol_app",
  },
};
