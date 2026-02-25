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
      label: "Lista",
      permission: ["default"],
      href: "/matches",
    },
    {
      label: "Jogadores",
      permission: ["admin"],
      href: "/admin/players",
    },
    {
      label: "Partidas",
      permission: ["admin"],
      href: "/admin/matches",
    },
  ],
  navMenuItems: [
    {
      label: "Início",
      permission: ["default"],
      href: "/",
    },
    {
      label: "Lista",
      permission: ["default"],
      href: "/matches",
    },
    {
      label: "Jogadores",
      permission: ["admin"],
      href: "/admin/players",
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
