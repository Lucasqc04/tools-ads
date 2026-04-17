export const siteConfig = {
  siteName: 'Tools Lucasqc',
  tagline: 'Ferramentas online rápidas, úteis e preparadas para SEO',
  description:
    'Hub de ferramentas online com foco em SEO técnico, UX, performance e estrutura pronta para Google AdSense.',
  url: 'https://tools.lucasqc.com',
  contactEmail: 'contato@tools.lucasqc.com',
  social: {
    twitter: '@toolslucasqc',
  },
  locale: 'pt_BR',
};

export const makeAbsoluteUrl = (path: string): string => {
  if (!path.startsWith('/')) {
    return `${siteConfig.url}/${path}`;
  }

  return `${siteConfig.url}${path}`;
};
