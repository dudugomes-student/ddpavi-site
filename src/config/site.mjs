// Single source of truth for company facts. Everything here comes from the current public site
// (ddpavidedetizadora.com). Items marked CONFIRMAR must be confirmed by the owner before publishing.
export const site = {
  name: 'DDPAVI Serviços Integrados',
  short: 'DDPavi',
  url: 'https://ddpavidedetizadora.com',
  locale: 'pt-BR',
  city: 'Jandira',
  region: 'SP',
  area: 'Grande São Paulo',
  tagline: 'Serviços no alvo.',
  whatsapp: { number: '5511916194867', display: '(11) 91619-4867' },
  phone: { tel: '+551147891000', display: '(11) 4789-1000' },
  // Licenças e responsável técnico valem só para o controle de pragas.
  // CONFIRMAR: as licenças abaixo constam no site atual; conferir números/validade antes de destacar documentos.
  licenses: ['ANVISA / Vigilância Sanitária', 'IBAMA', 'CETESB'],
  // CONFIRMAR: preencher issuer, number e validUntil com os dados dos documentos reais (validUntil no formato AAAA-MM-DD).
  // Campos vazios não aparecem no site. Não preencher sem o documento em mãos.
  certifications: [
    { name: 'ANVISA / Vigilância Sanitária', issuer: '', number: '', validUntil: '' },
    { name: 'IBAMA', issuer: '', number: '', validUntil: '' },
    { name: 'CETESB', issuer: '', number: '', validUntil: '' },
    { name: 'Responsável técnico habilitado', issuer: '', number: '', validUntil: '' },
  ],
  year: 2026,
};

export const nav = [
  { href: '/#servicos', label: 'Serviços integrados' },
  { href: '/controle-de-pragas/', label: 'Controle de pragas' },
  { href: '/#segmentos', label: 'Quem atendemos' },
  { href: '/sobre/', label: 'Sobre' },
  { href: '/contato/', label: 'Contato' },
];
