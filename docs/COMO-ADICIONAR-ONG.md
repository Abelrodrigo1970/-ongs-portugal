# 📘 Como Adicionar uma Nova ONG

Este guia explica como adicionar uma nova ONG à plataforma usando a rota dinâmica.

## 🎯 Visão Geral

A plataforma usa uma **rota dinâmica** (`/ongs/[id]`) que busca dados da base de dados PostgreSQL via Prisma.

## 📋 Pré-requisitos

1. Base de dados PostgreSQL configurada
2. Prisma configurado corretamente
3. Dados mestres criados:
   - AreaAtuacaoTipo
   - ColaboracaoTipo
   - ODS (Objetivos de Desenvolvimento Sustentável)

## 🚀 Passo a Passo

### 1️⃣ Preparar os Dados da ONG

Reúna as seguintes informações:

#### **Dados Obrigatórios:**
- Nome da ONG
- Descrição (parágrafo detalhado)
- Missão (frase curta e impactante)
- Email de contato
- Telefone
- Localização (cidade, país)
- Áreas de atuação (IDs da tabela `AreaAtuacaoTipo`)
- Tipos de colaboração aceitos (IDs da tabela `ColaboracaoTipo`)
- ODS relacionados (IDs da tabela `ODS`)

#### **Dados Opcionais:**
- Logo (URL ou caminho)
- Imagem de capa (URL ou caminho)
- Latitude e Longitude (para mapa)
- URL do Instagram
- URL do website
- URL de vídeo (YouTube, Vimeo)
- Métricas de impacto (array JSON)

### 2️⃣ Formato das Métricas de Impacto

As métricas são armazenadas como **JSON string** no campo `impacto`:

```json
[
  "85% da população sem-abrigo atendida",
  "Acompanhamento a centenas de pessoas",
  "Promoção da (re)integração no mercado de trabalho"
]
```

### 3️⃣ Criar a ONG na Base de Dados

#### **Opção A: Via Prisma Studio**

```bash
npx prisma studio
```

Navegue até a tabela `NGO` e adicione um novo registro.

#### **Opção B: Via Script SQL**

```sql
-- 1. Inserir a ONG
INSERT INTO "NGO" (
  "id",
  "nome",
  "descricao",
  "missao",
  "email",
  "telefone",
  "localizacao",
  "latitude",
  "longitude",
  "impacto",
  "logo",
  "imagem",
  "instagramUrl",
  "websiteUrl",
  "videoUrl",
  "visivel",
  "createdAt",
  "updatedAt"
) VALUES (
  'cais-porto-123',  -- ID único
  'Associação CAIS',
  'A CAIS trabalha há mais de 30 anos para criar oportunidades e promover a inclusão social...',
  'Transformamos vidas, todos os dias.',
  'cais@cais.pt',
  '222 071 320',
  'Porto, Portugal',
  41.1579,
  -8.6291,
  '["85% da população sem-abrigo", "Centenas de pessoas acompanhadas"]',
  '/images/logo-cais.svg',
  '/images/ongs/hero-cais.png',
  'https://instagram.com/cais',
  'https://cais.pt',
  'https://youtube.com/watch?v=exemplo',
  true,
  NOW(),
  NOW()
);

-- 2. Associar Áreas de Atuação
INSERT INTO "AreaAtuacao" ("id", "ngoId", "areaAtuacaoTipoId", "createdAt")
SELECT 
  gen_random_uuid()::text,
  'cais-porto-123',
  "id",
  NOW()
FROM "AreaAtuacaoTipo"
WHERE "nome" IN ('Inclusão social', 'Empregabilidade', 'Formação');

-- 3. Associar Tipos de Colaboração
INSERT INTO "Colaboracao" ("id", "ngoId", "colaboracaoTipoId", "createdAt")
SELECT 
  gen_random_uuid()::text,
  'cais-porto-123',
  "id",
  NOW()
FROM "ColaboracaoTipo"
WHERE "nome" IN ('Voluntariado', 'Doações financeiras', 'Mentoria');

-- 4. Associar ODS
INSERT INTO "NGOODS" ("id", "ngoId", "odsId", "createdAt")
SELECT 
  gen_random_uuid()::text,
  'cais-porto-123',
  "id",
  NOW()
FROM "ODS"
WHERE "numero" IN (1, 8, 10);
```

#### **Opção C: Via Seed Script**

Adicione em `prisma/seed.js`:

```javascript
const cais = await prisma.nGO.create({
  data: {
    id: 'cais-porto-123',
    nome: 'Associação CAIS',
    descricao: 'A CAIS trabalha há mais de 30 anos...',
    missao: 'Transformamos vidas, todos os dias.',
    email: 'cais@cais.pt',
    telefone: '222 071 320',
    localizacao: 'Porto, Portugal',
    latitude: 41.1579,
    longitude: -8.6291,
    impacto: JSON.stringify([
      '85% da população sem-abrigo',
      'Centenas de pessoas acompanhadas',
      'Promoção da (re)integração no mercado de trabalho'
    ]),
    logo: '/images/logo-cais.svg',
    imagem: '/images/ongs/hero-cais.png',
    instagramUrl: 'https://instagram.com/cais',
    websiteUrl: 'https://cais.pt',
    visivel: true,
    areaAtuacao: {
      create: [
        { tipo: { connect: { nome: 'Inclusão social' } } },
        { tipo: { connect: { nome: 'Empregabilidade' } } }
      ]
    },
    colaboracao: {
      create: [
        { tipo: { connect: { nome: 'Voluntariado' } } },
        { tipo: { connect: { nome: 'Doações financeiras' } } }
      ]
    },
    ods: {
      create: [
        { ods: { connect: { numero: 1 } } },
        { ods: { connect: { numero: 8 } } },
        { ods: { connect: { numero: 10 } } }
      ]
    }
  }
});
```

Execute:
```bash
npx prisma db seed
```

### 4️⃣ Adicionar Eventos da ONG (Opcional)

```sql
INSERT INTO "Event" (
  "id",
  "nome",
  "descricao",
  "dataInicio",
  "dataFim",
  "localizacao",
  "tipo",
  "maxParticipantes",
  "inscricoesAbertas",
  "linkInscricao",
  "imagem",
  "ngoId",
  "visivel",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Doações de Cestas Básicas',
  'Evento de distribuição de cestas básicas...',
  '2024-12-20 10:00:00',
  '2024-12-20 16:00:00',
  'Rua da Ribeira Negra 55, Porto',
  'PRESENCIAL',
  60,
  true,
  'https://cais.pt/eventos/cestas-basicas',
  '/images/events/event-cestas.png',
  'cais-porto-123',
  true,
  NOW(),
  NOW()
);
```

### 5️⃣ Adicionar Imagens (Opcional)

Coloque as imagens em:
- Logo: `public/images/logos/`
- Capa: `public/images/ongs/`
- Eventos: `public/images/events/`

Ou use URLs externas (Unsplash, Cloudinary, etc.)

### 6️⃣ Acessar a Página

Abra o navegador em:
```
http://localhost:3000/ongs/cais-porto-123
```

## 🔍 Verificar se Funcionou

A página deve exibir:
- ✅ Logo e nome da ONG
- ✅ Localização e website
- ✅ Badges de áreas de atuação
- ✅ Botões de ação
- ✅ Missão e descrição
- ✅ Métricas de impacto (3 banners)
- ✅ Áreas de atuação com ícones
- ✅ Eventos próximos (se existirem)
- ✅ Vídeo (se tiver URL)
- ✅ Informações de contato
- ✅ ODS relacionados

## 🐛 Troubleshooting

### Problema: "ONG não encontrada"
- Verifique se o ID está correto
- Confirme que `visivel = true`
- Verifique a conexão com a base de dados

### Problema: "Métricas não aparecem"
- Verifique se `impacto` é um JSON válido
- Deve ser um array de strings: `["Métrica 1", "Métrica 2"]`

### Problema: "Áreas de atuação sem ícones"
- Verifique se os nomes das áreas estão no `areaIcons.js`
- Adicione mapeamento em `lib/utils/areaIcons.js`

### Problema: "Eventos não aparecem"
- Verifique se `ngoId` dos eventos corresponde ao ID da ONG
- Confirme que `visivel = true` nos eventos
- Verifique se as datas são futuras

## 📚 Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Schema da Base de Dados](../prisma/schema.prisma)
- [Componentes UI](../components/)

## 🎨 Customização

Para customizar o layout da página, edite:
```
app/ongs/[id]/page.js
```

Para adicionar novos componentes:
```
components/ngo/
```

## 🚀 Próximos Passos

Após adicionar a ONG:
1. Adicione eventos relacionados
2. Teste a página em diferentes dispositivos
3. Verifique SEO com `view-source:`
4. Compartilhe o link nas redes sociais

---

**Nota:** Esta documentação assume que você tem acesso à base de dados e conhecimentos básicos de SQL ou Prisma.

