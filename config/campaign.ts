/**
 * CONFIGURAÇÃO DA CAMPANHA
 * Praticamente tudo o que aparece no site sai daqui. Confira os dados antes de publicar.
 */
export const campaign = {
  candidate: {
    publicName: "Chapinha da Vela",
    legalName: "José Marilton da Cruz",
    // Número e partido conforme cadastro publicado (O Tempo / TSE). Confirmar com a coordenação.
    number: "15026",
    party: "MDB",
    position: "Deputado Estadual",
    state: "SP",
    photo: "/images/chapinha.png", // PNG com fundo transparente (meio corpo)
    avatar: "/images/chapinha-rosto.png", // recorte do rosto, usado nos cards
    logo: "/images/logo-chapinha.png", // logo azul
    logoWhite: "/images/logo-chapinha-branco.png", // logo para fundo azul
  },

  election: {
    year: 2026,
    firstRound: "4 de outubro de 2026",
    firstRoundShort: "4 de outubro",
    state: "São Paulo",
  },

  colors: {
    blue: "#004aad",
    pink: "#fc227d",
    yellow: "#ffc000",
    white: "#ffffff",
  },

  social: {
    instagram: "",
    website: "",
  },

  legal: {
    cnpj: "68.293.645/0001-01", // CNPJ da campanha (obrigatório na propaganda)
    disclaimer: "", // ex.: coligação/federação, tiragem, etc.
  },

  seo: {
    title: "Minha Colinha 2026 | Chapinha da Vela",
    description:
      "Monte sua colinha para as Eleições 2026 e tenha seus números organizados para consultar no dia da votação.",
    ogImage: "/og-image.jpg",
  },
} as const;

/** Linha legal da propaganda: "CNPJ: … | ELEIÇÃO 2026 | NOME | CARGO". */
export const legalLine = campaign.legal.cnpj
  ? [
      `CNPJ: ${campaign.legal.cnpj}`,
      `ELEIÇÃO ${campaign.election.year}`,
      campaign.candidate.legalName.toUpperCase(),
      campaign.candidate.position.toUpperCase(),
    ].join(" | ")
  : "";

export type Campaign = typeof campaign;
