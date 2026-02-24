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
      label: "Jogadores",
      permission: ["admin"],
      href: "/admin/players",
    },
    {
      label: "Partidas",
      permission: ["admin"],
      href: "/admin/matches",
    },
    {
      label: "Lista",
      permission: ["default"],
      href: "/matches",
    },
  ],
  navMenuItems: [
    {
      label: "Início",
      permission: ["default"],
      href: "/",
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
    {
      label: "Lista",
      permission: ["default"],
      href: "/matches",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
