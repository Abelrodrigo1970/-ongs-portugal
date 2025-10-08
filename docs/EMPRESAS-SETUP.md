# 🏢 Setup - Funcionalidades de Empresas

## 📋 Visão Geral

Este documento explica como implementar as funcionalidades de **Perfil da Empresa** e **Dashboard da Empresa** na aplicação de ONGs existente.

## 🚀 Passos de Implementação

### **1. Criar Migration do Prisma**

```bash
# Copiar schema-empresas.prisma para schema.prisma
# Adicionar os models ao final do schema.prisma existente

npx prisma migrate dev --name add_empresas_system
```

### **2. Executar SQL no Supabase**

```bash
# Executar o ficheiro database-schema-empresas.sql no Supabase
# Pode usar o SQL Editor ou psql
```

### **3. Gerar Prisma Client**

```bash
npx prisma generate
```

### **4. Seed de Dados Iniciais**

```bash
# Executar seed para criar dados de exemplo
npm run db:seed
```

## 📁 Estrutura de Ficheiros a Criar

```
lib/repositories/
├─ empresas.js          # CRUD de empresas
├─ colaboradores.js     # Gestão de colaboradores
├─ iniciativas.js       # Gestão de iniciativas
├─ propostas.js         # Gestão de propostas
├─ reunioes.js          # Gestão de reuniões
└─ dashboard.js         # Queries para dashboard

app/
├─ empresas/
│  ├─ page.js           # Listagem de empresas
│  ├─ [id]/
│  │  └─ page.js        # Perfil da empresa
│  └─ dashboard/
│     └─ page.js        # Dashboard da empresa
├─ api/
│  ├─ empresas/
│  │  └─ route.js       # API de empresas
│  ├─ iniciativas/
│  │  └─ route.js       # API de iniciativas
│  └─ propostas/
│     └─ route.js       # API de propostas

components/
├─ empresa/
│  ├─ EmpresaCard.js    # Card de empresa
│  ├─ Dashboard/
│  │  ├─ ImpactoChart.js      # Gráfico de impacto
│  │  ├─ ProjetosChart.js     # Gráfico de projetos
│  │  ├─ VoluntariadoChart.js # Gráfico de voluntariado
│  │  └─ KPICards.js          # Cards de KPIs
│  ├─ IniciativaCard.js       # Card de iniciativa
│  └─ PropostaCard.js         # Card de proposta
```

## 🎯 Funcionalidades Principais

### **Perfil da Empresa**

- ✅ Informações gerais da empresa
- ✅ ODS trabalhados (com imagens)
- ✅ Tipos de apoio oferecidos
- ✅ Causas apoiadas
- ✅ Iniciativas ativas
- ✅ Estatísticas de impacto
- ✅ Contactos e localização

### **Dashboard da Empresa**

#### **📊 KPIs Principais:**
1. Total de horas de voluntariado
2. Número de projetos ativos
3. Número de voluntários
4. Propostas recebidas

#### **📈 Gráficos:**
1. **Linha**: Evolução de horas ao longo do tempo
2. **Barras**: Projetos por causa
3. **Pizza**: Distribuição por tipo de apoio
4. **Área**: Comparação por ODS

#### **📋 Listagens:**
- Iniciativas (filtro por status, causa, data)
- Colaboradores inscritos
- Propostas recebidas
- Reuniões agendadas

### **Gestão de Iniciativas**

- ✅ Criar/editar iniciativas
- ✅ Definir vagas e datas
- ✅ Gerir inscrições de colaboradores
- ✅ Acompanhar progresso
- ✅ Registar horas contribuídas

### **Propostas de ONGs**

- ✅ ONGs enviam propostas para empresas
- ✅ Empresa analisa e responde
- ✅ Workflow: Pendente → Análise → Aprovada/Rejeitada
- ✅ Pode agendar reunião a partir da proposta

### **Reuniões**

- ✅ Agendar reunião entre empresa e ONG
- ✅ Tipos: Presencial, Online, Híbrida
- ✅ Status: Agendada → Confirmada → Realizada
- ✅ Link para reunião online
- ✅ Notas da reunião

## 🔧 Configurações Necessárias

### **Variáveis de Ambiente (.env.local)**

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Upload de ficheiros (opcional)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Email (opcional para notificações)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### **Permissões**

```sql
-- Row Level Security (RLS) para PostgreSQL
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE iniciativas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (exemplo)
CREATE POLICY "Empresas podem ver suas próprias informações"
ON empresas FOR SELECT
USING (id = current_setting('app.current_empresa_id')::text);
```

## 📊 Queries Exemplo

### **Dashboard: Resumo Rápido**

```sql
SELECT 
    SUM(horas_voluntariado) as total_horas,
    SUM(num_projetos) as total_projetos,
    SUM(num_voluntarios) as total_voluntarios
FROM estatisticas_impacto_empresa
WHERE empresa_id = $1 
AND periodo_ano = EXTRACT(YEAR FROM CURRENT_DATE);
```

### **Iniciativas Próximas**

```sql
SELECT * FROM iniciativas
WHERE empresa_id = $1 
AND status = 'ATIVA'
AND data_inicio >= CURRENT_DATE
ORDER BY data_inicio ASC
LIMIT 5;
```

### **Propostas Pendentes**

```sql
SELECT p.*, n.nome as ong_nome, n.logo as ong_logo
FROM propostas p
JOIN "NGO" n ON p.ong_id = n.id
WHERE p.empresa_id = $1 
AND p.status = 'PENDENTE'
ORDER BY p.created_at DESC;
```

## 🎨 Componentes UI Sugeridos

### **Dashboard Principal**
```jsx
<EmpresaDashboard>
  <KPICards /> {/* Total horas, projetos, voluntários, propostas */}
  <ImpactoChart /> {/* Gráfico de linha - evolução */}
  <ProjetosChart /> {/* Gráfico de barras - por causa */}
  <VoluntariadoChart /> {/* Gráfico de pizza - tipo apoio */}
  <IniciativasList /> {/* Lista de iniciativas */}
  <PropostasList /> {/* Lista de propostas */}
</EmpresaDashboard>
```

### **Perfil da Empresa**
```jsx
<EmpresaPerfil>
  <EmpresaHeader /> {/* Logo, nome, missão */}
  <ODSSection /> {/* ODS com imagens */}
  <TiposApoioSection /> {/* Tipos de apoio oferecidos */}
  <CausasSection /> {/* Causas apoiadas */}
  <ImpactoSection /> {/* Estatísticas resumidas */}
  <IniciativasSection /> {/* Iniciativas ativas */}
  <ContatoSection /> {/* Email, telefone, website */}
</EmpresaPerfil>
```

## 🔄 Fluxos de Trabalho

### **Fluxo 1: Empresa cria Iniciativa**
```
1. Empresa → Criar Iniciativa (RASCUNHO)
2. Definir: título, descrição, causa, tipo_apoio, vagas, datas
3. Publicar → Status: ATIVA
4. Colaboradores → Inscrever-se
5. Empresa → Gerir inscrições (confirmar/rejeitar)
6. Iniciativa → Decorre
7. Registar horas contribuídas
8. Concluir → Status: CONCLUIDA
9. Estatísticas → Atualizar automaticamente
```

### **Fluxo 2: ONG envia Proposta**
```
1. ONG → Criar Proposta para Empresa
2. Status: PENDENTE
3. Empresa → Recebe notificação
4. Empresa → Analisa (EM_ANALISE)
5. Empresa → Responde (APROVADA/REJEITADA)
6. Se APROVADA → Pode agendar reunião
7. Se APROVADA → Pode criar iniciativa
```

### **Fluxo 3: Agendamento de Reunião**
```
1. Empresa ou ONG → Criar Reunião
2. Define: título, data/hora, tipo, local/link
3. Status: AGENDADA
4. Confirmação mútua → CONFIRMADA
5. Reunião acontece → REALIZADA
6. Adicionar notas da reunião
7. Próximos passos registados
```

## 📈 Métricas de Performance

- **Dashboard load time**: < 500ms (com views materializadas)
- **Gráficos**: < 200ms (com índices otimizados)
- **Listagens**: Paginação de 20 itens
- **Export**: Processamento assíncrono para grandes volumes

## 🔐 Segurança

- ✅ Validação de inputs (Zod)
- ✅ Autenticação obrigatória
- ✅ Autorização por empresa_id
- ✅ Rate limiting em APIs
- ✅ CORS configurado
- ✅ SQL injection protection (Prisma)

## 📝 Próximos Passos

1. [ ] Criar migrations no Prisma
2. [ ] Implementar repositories
3. [ ] Criar API routes
4. [ ] Desenvolver componentes UI
5. [ ] Implementar dashboard com gráficos
6. [ ] Adicionar sistema de notificações
7. [ ] Implementar exportação de relatórios
8. [ ] Testes unitários e integração
