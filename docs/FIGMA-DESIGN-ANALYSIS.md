# Análise Detalhada do Design Figma - Página da ONG

## Link do Design
https://www.figma.com/design/Uxjr1o8qLBwMBWyjh18Uqz/Final?node-id=3-406&m=dev

## Estrutura Geral
- **Container Principal**: `About Section`
  - Largura: `920px`
  - Altura: `3973.82px`
  - Padding Top: `304px`
  - Gap entre seções: `32px` (var(--xl))

---

## Seção 1: Card NPO Info
**Posição**: Topo da página (y: 304px)

### Dimensões
- Largura: `918px`
- Altura: `268px`
- Border Radius: `32px`
- Padding: `40px` (var(--spacing/xxl))

### Cores
- Background: `rgba(248,250,252,0.05)` com backdrop-blur
- Border: `#cbd5e1` (var(--default))
- Texto Nome: `#020617` (var(--content/fill/primary))
- Texto Localização/Site: `#64748b` (var(--content/fill/tertiary))

### Componentes Internos

#### Header (NPO Name + Avatar)
- Avatar: `48px x 48px`
- Nome: Fonte `Inter Semi Bold`, `40px`, line-height `1.2`
- Localização/Site: Fonte `Inter Regular`, `16px`, line-height `1.5`
- Ícones: `16px x 16px`
- Divider: `1px`, cor `#e2e8f0` (var(--divider))

#### Labels (Áreas de Atuação)
- Border: `#64748b` (var(--tertiary))
- Border Radius: `8px` (var(--border-radius/md))
- Padding: `16px` horizontal, `4px` vertical
- Texto: Fonte `Inter Semi Bold`, `14px`, line-height `1.4`, cor `#64748b`

#### Botões
- **Botão Primário**:
  - Background: `#155dfc` (var(--brand-primary-default))
  - Texto: `#f1f5f9` (var(--content/text/white))
  - Fonte: `Inter Bold`, `18px`, line-height `1.75`
  - Padding: `24px` horizontal, `8px` vertical
  - Border Radius: `100px`
  - Ícone seta: `24px x 24px`, cor branca

- **Botão Outline**:
  - Border: `2px solid #cbd5e1`
  - Texto: `#020617`
  - Mesmas dimensões do botão primário

---

## Seção 2: Título e Parágrafo
**Posição**: Após o card NPO

### Dimensões
- Largura: `920px`
- Altura: `160px`
- Padding: `16px` top, `32px` bottom

### Tipografia
- **Título**: 
  - Fonte: `Inter Semi Bold`
  - Tamanho: `40px` (var(--title-l))
  - Line-height: `1.2`
  - Cor: `#1e293b` (neutral-700)
  
- **Parágrafo**:
  - Fonte: `Inter Regular`
  - Tamanho: `18px` (var(--body-l))
  - Line-height: `1.75`
  - Cor: `#595959`
  - Largura: `918px`

---

## Seção 3: Métricas (About us)
**Posição**: Após título e parágrafo

### Dimensões
- Largura: `920px`
- Altura: `94px`
- Background: `rgba(242,242,247,0.05)`
- Padding: `16px` horizontal

### Layout
- 3 métricas com divisores entre elas
- Gap entre métricas: `60px`
- Divisores: `1px` de altura `64px`, cor `#e2e8f0`

### Métrica Individual
- Largura: `188px`
- Altura: `94px`
- **Número**: 
  - Fonte: `Inter Bold`
  - Tamanho: `48px` (var(--display-m))
  - Line-height: `1.2`
  - Cor: `#020617`
  
- **Texto**:
  - Fonte: `Inter Bold`
  - Tamanho: `20px` (var(--subtitle-m))
  - Line-height: `1.4`
  - Cor: `#64748b` (var(--content/text/tertiary))

---

## Seção 4: Áreas de Atuação
**Posição**: Após métricas

### Dimensões
- Largura: `920px`
- Altura: `272px`
- Gap entre título e cards: `16px`
- Gap entre cards: `24px`

### Título
- Fonte: `Inter Semi Bold`
- Tamanho: `40px` (var(--title-l))
- Line-height: `1.2`
- Cor: `#1e1e1e`

### Cards Grid
- Layout: 4 colunas x 2 linhas
- Cards por linha: `4`
- Largura do card: `212px`
- Altura do card: `92px`
- Border: `1px solid #cbd5e1`
- Border Radius: `16px`
- Padding interno: `8px` horizontal, `16px` vertical

### Card Individual
- Ícone: `24px x 24px`, opacidade `0.9`
- Cor do ícone: `rgba(21, 93, 252, 1)` (#155dfc)
- Texto: Fonte `Inter Bold`, `18px`, line-height `1.75`, cor `#1e293b`
- Gap entre ícone e texto: `4px`

---

## Seção 5: Próximos Eventos
**Posição**: Após Áreas de Atuação

### Dimensões
- Largura: `920px`
- Altura: `497px`
- Gap entre título e cards: `24px`

### Header
- Título: Fonte `Inter Semi Bold`, `40px`, line-height `1.2`, cor `#1e1e1e`
- Controles de navegação: `112.8px` de largura, `47px` de altura
  - Botão anterior: Background `#f2f2f7`, tamanho `55.225px x 55.225px`
  - Botão próximo: Background `#e8e8e8`, tamanho `55.225px x 55.225px`
  - Ícone: `23.5px x 13.836px`, cor `rgba(64, 64, 64, 1)`

### Cards de Eventos
- Layout: 3 colunas
- Gap entre cards: `24px`
- Largura de cada card: `290.67px` (flex-1)
- Altura: `409px`
- Background: `#ffffff` (var(--surface-default))
- Border: `1px solid #d9d9d9` (var(--border-default))
- Border Radius: `32px` (var(--border-radius/xxxl))

### Card de Evento Individual

#### Imagem do Evento
- Altura: `120px`
- Border Radius: `4px`
- Padding: `6px`
- Badge de vagas:
  - Background: `#ebf2ff` (var(--brand-primary-light))
  - Padding: `8px` horizontal, `4px` vertical
  - Border Radius: `200px`
  - Ícone: `16px x 16px`
  - Texto: Fonte `Inter Medium`, `14px`, line-height `1.2`
  - Número em negrito: `#155dfc`
  - Texto secundário: `neutral-400`

#### Conteúdo do Card
- Padding: `16px` horizontal, `24px` bottom
- Gap interno: `16px`

**Título do Evento**:
- Fonte: `Inter Bold`
- Tamanho: `20px` (var(--subtitle-m))
- Line-height: `1.4`
- Cor: `#595959` (var(--text-secondary))

**Informações (Localização, Data, Hora)**:
- Gap entre itens: `8px` horizontal, `4px` vertical
- Ícones: `16px x 16px`
- Texto: Fonte `Inter Regular`, `14px`, line-height `1.5`, cor `#595959`, opacidade `0.7`

**Descrição**:
- Fonte: `Inter Regular`
- Tamanho: `16px` (var(--body-m))
- Line-height: `1.5`
- Cor: `#595959`

**Botão "Quero colaborar"**:
- Background: `#155dfc`
- Padding: `16px` horizontal, `8px` vertical
- Border Radius: `100px`
- Texto: Fonte `Inter Medium`, `16px`, cor `white`
- Ícone seta: `16px x 16px`, cor branca
- Gap entre texto e ícone: `16px`

---

## Seção 6: Vídeo Institucional
**Posição**: Após Próximos Eventos

### Dimensões
- Largura: `920px`
- Altura: `564.5px`
- Padding: `32px` top, `60px` bottom

### Container do Vídeo
- Largura: `920px`
- Altura: `472.5px`
- Border Radius: `4px`
- Background overlay: `rgba(0,0,0,0.4)`
- Opacidade da imagem: `0.8`

### Ícone de Play
- Tamanho: `75px x 60px`
- Posição: Centralizado (absolute, top 50%, left 50%, transform -50%)

---

## Seção 7: Projetos em Destaque
**Posição**: Após Vídeo

### Dimensões
- Largura: `920px`
- Altura: `969.32px`
- Gap entre projetos: `64px`

### Projeto Individual

#### Layout Alternado
- **Projeto 1 e 3**: Imagem à esquerda, texto à direita
- **Projeto 2**: Texto à esquerda, imagem à direita

#### Imagem do Projeto
- Largura: `290px`
- Altura: `266px` (projeto 1), `277.32px` (projeto 2), `298px` (projeto 3)
- Border Radius: `16px`

#### Texto do Projeto
- Largura: `606px`
- Gap entre título e descrição: `8px`

**Título**:
- Fonte: `Inter Semi Bold`
- Tamanho: `24px` (var(--title-s))
- Line-height: `1.4`
- Cor: `#1e293b` (neutral-700)
- Largura: `526px`

**Descrição**:
- Fonte: `Inter Regular`
- Tamanho: `18px` (var(--body-l))
- Line-height: `1.75`
- Cor: `#595959`
- Largura: `606px`

---

## Seção 8: Informações de Contato
**Posição**: Final da página

### Container Principal
- Largura: `918px`
- Altura: `621px`
- Background: `rgba(242,242,247,0.05)` com backdrop-blur
- Border: `1px solid rgba(64,64,64,0.15)`
- Border Radius: `32px`
- Padding: `24px` top, `32px` bottom, `32px` horizontal
- Gap entre itens: `32px`

### Itens de Informação
Cada item tem:
- Altura: `40px`
- Padding vertical: `8px`
- Divisor: `1px`, cor `rgba(64,64,64,0.15)`, largura `854px`

### Tipografia dos Itens
- **Label (esquerda)**:
  - Fonte: `Inter Bold`
  - Tamanho: `20px`
  - Line-height: `1.2`
  - Cor: `#1e1e1e`

- **Valor (direita)**:
  - Fonte: `Inter Regular`
  - Tamanho: `20px`
  - Line-height: `1.2`
  - Cor: `#1e293b` (neutral-700)
  - Links: sublinhados (underline)

### Itens Específicos

#### Site
- Valor: Link sublinhado, cor `neutral-700`

#### Tipos de Colaboração
- Valores separados por divisores verticais (`1px`, cor `rgba(64,64,64,0.15)`)
- Gap entre valores: `16px`
- Emojis incluídos: 🤝 🧩 💡

#### ODS
- Valor: "-" (hífen), sublinhado

#### Redes Sociais
- Valores: Links sublinhados separados por divisores
- Redes: Facebook, Tiktok, Linkedin, Instagram

#### Contacto
- Email: `cais@cais.pt`
- Telefone: `222 071 320`
- Separados por divisor vertical

#### Morada
- Valor: `Rua da Ribeira Negra 55, 4050-321 Porto`

---

## Paleta de Cores Completa

### Cores Principais
- **Primary Blue**: `#155dfc` (var(--brand-primary-default))
- **Primary Light**: `#ebf2ff` (var(--brand-primary-light))
- **Text Primary**: `#020617` (var(--content/fill/primary))
- **Text Secondary**: `#595959`
- **Text Tertiary**: `#64748b` (var(--content/fill/tertiary))
- **White**: `#f1f5f9` (var(--content/text/white))
- **Neutral 700**: `#1e293b`
- **Neutral 400**: (para texto secundário em badges)

### Cores de Background
- **Surface Default**: `#ffffff`
- **Blur Background**: `rgba(248,250,252,0.05)`
- **Blur Background 2**: `rgba(242,242,247,0.05)`
- **Badge Background**: `#f2f2f7` (botão anterior)
- **Badge Background 2**: `#e8e8e8` (botão próximo)

### Cores de Border
- **Default Border**: `#cbd5e1` (var(--default))
- **Border Default**: `#d9d9d9` (var(--border-default))
- **Tertiary Border**: `#64748b` (var(--tertiary))
- **Divider**: `#e2e8f0` (var(--divider))
- **Divider Dark**: `rgba(64,64,64,0.15)`

### Cores de Overlay
- **Video Overlay**: `rgba(0,0,0,0.4)`

---

## Espaçamentos (Spacing System)

- **xxs**: `4px`
- **xs**: `8px`
- **md**: `16px`
- **lg**: `24px`
- **xl**: `32px`
- **xxl**: `40px`

---

## Tipografia Completa

### Font Family
- **Primary**: `Inter`
- **Weights**: Regular (400), Medium (500), Semi Bold (600), Bold (700)

### Tamanhos de Fonte
- **Display M**: `48px`, line-height `1.2`
- **Title L**: `40px`, line-height `1.2`
- **Title S**: `24px`, line-height `1.4`
- **Subtitle M**: `20px`, line-height `1.4`
- **Body L**: `18px`, line-height `1.75`
- **Body M**: `16px`, line-height `1.5`
- **Body S**: `14px`, line-height `1.5`
- **Label**: `14px`, line-height `1.4`

---

## Border Radius

- **sm**: `4px`
- **md**: `8px`
- **lg**: `16px`
- **xl**: `32px` (var(--border-radius/xxxl))
- **full**: `100px` / `200px` (para badges e botões)

---

## Ícones

### Tamanhos Padrão
- **Small**: `16px x 16px`
- **Medium**: `24px x 24px`
- **Large**: `48px x 48px` (avatar)

### Ícones Utilizados
- `location_on`: Localização
- `language`: Website
- `arrow_forward`: Setas de navegação
- `calendar_today`: Data
- `schedule`: Hora
- `how_to_reg`: Vagas/Registro
- `smart_display`: Play do vídeo

---

## Observações Importantes

1. **Responsividade**: O design é fixo em `920px` de largura, pode precisar de adaptação para mobile
2. **Backdrop Blur**: Usado em cards principais para efeito de vidro fosco
3. **Z-index**: Cards de áreas de atuação têm z-index de 1 a 8 para sobreposição
4. **Flexbox**: Uso extensivo de flexbox para layout
5. **Gap System**: Sistema consistente de gaps entre elementos
6. **Opacity**: Uso de opacidade (0.7, 0.8, 0.9) para hierarquia visual
7. **Border Radius**: Uso consistente de border radius arredondado (16px, 32px, 100px, 200px)

