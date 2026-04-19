export const siteConfig = {
  siteName: 'Tools Lucasqc',
  tagline: 'Ferramentas online rápidas, úteis e sem complicação',
  description:
    'Hub de ferramentas online para tarefas do dia a dia, com foco em velocidade, privacidade e boa experiência em desktop e mobile.',
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
