# ONGs Portugal

Uma plataforma web para conectar organizações não-governamentais (ONGs) com pessoas interessadas em colaborar, baseada nos Objetivos de Desenvolvimento Sustentável (ODS) das Nações Unidas.

## 🚀 Funcionalidades

- **Catálogo de ONGs**: Explore organizações não-governamentais em Portugal
- **Filtros Avançados**: Busque por ODS, áreas de atuação, tipos de colaboração
- **Detalhes Completos**: Informações detalhadas sobre cada ONG
- **Mapas Interativos**: Localização das ONGs usando Leaflet
- **Vídeos Responsivos**: Suporte para YouTube e Vimeo
- **Painel de Administração**: Interface de gestão para dados (apenas desenvolvimento)
- **Design Responsivo**: Otimizado para todos os dispositivos

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 (App Router), React, JavaScript
- **Styling**: Tailwind CSS
- **Base de Dados**: Prisma ORM com SQLite (desenvolvimento)
- **Mapas**: Leaflet com OpenStreetMap
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd ricardo
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Configurar base de dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações e seed
npm run db:reset
```

### 5. Executar em desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm run start

# Linting
npm run lint

# Base de dados
npm run db:generate    # Gerar cliente Prisma
npm run db:migrate     # Executar migrações
npm run db:reset       # Reset completo + seed
npm run db:seed        # Executar apenas seed
```

## 🗄️ Estrutura da Base de Dados

### Modelos Principais

- **NGO**: Organizações não-governamentais
- **ODS**: Objetivos de Desenvolvimento Sustentável (1-17)
- **AreaAtuacaoTipo**: Tipos de áreas de atuação
- **ColaboracaoTipo**: Tipos de colaboração disponíveis

### Relações

- ONG ↔ ODS (muitos para muitos)
- ONG ↔ Áreas de Atuação (muitos para muitos)
- ONG ↔ Tipos de Colaboração (muitos para muitos)

## 📁 Estrutura do Projeto

```
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página inicial
│   ├── ongs/              # Páginas de ONGs
│   ├── ods/               # Páginas de ODS
│   └── admin/             # Painel de administração
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizáveis
│   ├── layout/           # Componentes de layout
│   ├── admin/            # Componentes de administração
│   └── home/             # Componentes da página inicial
├── lib/                  # Utilitários e configurações
│   ├── db.js            # Cliente Prisma
│   └── repositories/    # Funções de acesso a dados
├── prisma/              # Schema e migrações
│   ├── schema.prisma    # Schema da base de dados
│   └── seed.js          # Dados iniciais
└── public/              # Ficheiros estáticos
```

## 🎨 Design e UX

- **Design System**: Baseado no Figma fornecido
- **Cores**: Paleta de cores dos ODS da ONU
- **Tipografia**: Inter font family
- **Responsividade**: Mobile-first, breakpoints em 768px, 1024px, 1280px
- **Acessibilidade**: WCAG AA, navegação por teclado, focus rings

## 🔍 Funcionalidades de Busca

### Filtros Disponíveis

- **Texto**: Busca por nome, descrição ou missão
- **ODS**: Seleção múltipla de Objetivos de Desenvolvimento Sustentável
- **Áreas de Atuação**: Filtro por áreas de trabalho
- **Tipos de Colaboração**: Formas de colaborar com as ONGs
- **Visibilidade**: Mostrar apenas ONGs visíveis

### Ordenação

- Nome A-Z / Z-A
- Mais recentes
- Mais ODS (maior correspondência)

## 🗺️ Mapas

- **Leaflet**: Biblioteca de mapas open-source
- **OpenStreetMap**: Dados de mapas gratuitos
- **Marcadores**: Localização das ONGs (quando disponível)
- **Fallback**: Texto de localização quando coordenadas não disponíveis

## 📱 Vídeos

- **YouTube**: Suporte completo para URLs do YouTube
- **Vimeo**: Suporte para URLs do Vimeo
- **Responsivo**: Aspect ratio 16:9 mantido em todos os dispositivos
- **Lazy Loading**: Carregamento otimizado

## 🛡️ Administração

O painel de administração está disponível apenas em desenvolvimento (`/admin`):

- **ONGs**: Gestão completa de organizações
- **ODS**: Edição de informações dos objetivos
- **Áreas**: CRUD de áreas de atuação
- **Colaboração**: CRUD de tipos de colaboração

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`: URL da base de dados PostgreSQL
   - `NEXT_PUBLIC_SITE_URL`: URL do site
3. Execute o deploy

### Outras Plataformas

Para outras plataformas, certifique-se de:

1. Configurar uma base de dados PostgreSQL
2. Executar `npm run db:migrate` após o deploy
3. Configurar as variáveis de ambiente adequadas

## 📝 Dados de Exemplo

O sistema inclui dados de exemplo:

- **17 ODS**: Todos os Objetivos de Desenvolvimento Sustentável
- **8 Tipos de Colaboração**: Parcerias, voluntariado, doações, etc.
- **15 Áreas de Atuação**: Ação social, ambiente, educação, etc.
- **7 ONGs**: Organizações exemplo com dados completos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit das alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o ficheiro [LICENSE](LICENSE) para detalhes.

## 📞 Contacto

Para questões ou sugestões, entre em contacto através do email: info@ongsportugal.pt

---

**ONGs Portugal** - Conectando organizações e pessoas para um mundo melhor 🌍







