# 🏢 Modelo de Dados - Empresas e Colaboração

## 📋 Visão Geral

Este modelo de dados estende a aplicação de ONGs existente para incluir funcionalidades de:
- **Perfil da Empresa**: Informações, áreas de atuação, tipos de apoio
- **Dashboard da Empresa**: Estatísticas, iniciativas, colaboradores
- **Colaboração**: Propostas, reuniões, favoritos entre ONGs e Empresas

## 🗄️ Estrutura de Tabelas

### **1. Empresas (Tabela Principal)**
```
empresas
├─ Informações básicas: nome, missão, descrição, setor
├─ Contacto: email, telefone, website
├─ Localização: endereço, latitude, longitude
└─ Metadados: logo, visibilidade, timestamps
```

**Relações:**
- **1:N** → Colaboradores, Iniciativas, Propostas, Reuniões, Exportações
- **N:M** → ODS, Causas, Tipos de Apoio
- **N:M** → ONGs (via Favoritos)

### **2. Tipos de Apoio**
```
tipos_apoio_empresa
├─ Tempo/Voluntariado (presencial, online)
├─ Conhecimento/Capacitação (formação, mentoria)
├─ Recursos/Serviços (consultoria, espaço físico)
└─ Produtos/Bens (equipamentos, materiais)
```

### **3. Estatísticas de Impacto**
```
estatisticas_impacto_empresa
├─ Granularidade: ano + mês
├─ Métricas: horas_voluntariado, num_projetos, num_voluntarios, valor_doacoes
└─ Agregação: por período temporal
```

### **4. Iniciativas**
```
iniciativas
├─ Informação: título, descrição, datas
├─ Gestão: vagas, status, tipo de apoio
├─ Localização: endereço, coordenadas
└─ Ligações: empresa, causa
```

### **5. Colaboradores**
```
colaboradores
├─ Dados: nome, email, departamento, cargo
├─ Estado: ativo/inativo
└─ Relações: inscrições em iniciativas
```

### **6. Propostas**
```
propostas
├─ Origem: ONG envia para Empresa
├─ Contexto: pode estar ligada a iniciativa específica
├─ Status: pendente → análise → aprovada/rejeitada
├─ Anexos: metadados em JSON
└─ ODS relacionados: array de IDs
```

### **7. Reuniões**
```
reunioes
├─ Participantes: empresa + ONG
├─ Contexto: pode estar ligada a proposta
├─ Tipo: presencial, online, híbrida
├─ Agendamento: start_at, end_at, status
└─ Controlo: criado por empresa ou ONG
```

### **8. Causas**
```
causas
├─ Áreas temáticas (Educação, Ambiente, Saúde, etc.)
├─ Ligação a empresas (m:n)
└─ Ligação a iniciativas (1:n)
```

## 🔍 Índices e Otimizações

### **Índices Principais:**
1. `idx_estatisticas_empresa_periodo` - Dashboard de impacto
2. `idx_iniciativas_empresa_status` - Listagem de iniciativas
3. `idx_inscricoes_iniciativa` - Gestão de inscrições
4. `idx_propostas_empresa_status` - Gestão de propostas
5. `idx_reunioes_empresa_data` - Agenda de reuniões
6. `idx_colaboradores_empresa_ativo` - Colaboradores ativos

### **Views Materializadas:**

#### **1. vista_impacto_mensal_empresa**
- Agrega estatísticas por mês
- Acelera queries de gráficos temporais
- Refresh: diário ou após inserção de dados

#### **2. resumo_dashboard_empresa**
- KPIs principais em cache
- Total iniciativas, colaboradores, inscrições, propostas
- Refresh: horário ou em tempo real (triggers)

## 📊 Queries para Gráficos do Dashboard

### **Gráfico 1: Evolução de Horas (Linha)**
```sql
SELECT periodo_ano, periodo_mes, SUM(horas_voluntariado) as horas 
FROM estatisticas_impacto_empresa 
WHERE empresa_id = $1 AND periodo_ano >= $2 
GROUP BY periodo_ano, periodo_mes 
ORDER BY periodo_ano, periodo_mes;
```

### **Gráfico 2: Projetos por Causa (Barras)**
```sql
SELECT c.nome, COUNT(i.id) as total 
FROM iniciativas i 
JOIN empresa_causas ec ON i.empresa_id = ec.empresa_id 
JOIN causas c ON ec.causa_id = c.id 
WHERE i.empresa_id = $1 
GROUP BY c.nome 
ORDER BY total DESC;
```

### **Gráfico 3: Distribuição por Tipo de Apoio (Pizza)**
```sql
SELECT tipo_apoio, COUNT(*) as total 
FROM iniciativas 
WHERE empresa_id = $1 AND status = 'CONCLUIDA' 
GROUP BY tipo_apoio;
```

### **Gráfico 4: Impacto por ODS (Área)**
```sql
SELECT o.numero, o.nome, SUM(est.horas_voluntariado) as horas 
FROM empresa_ods eo 
JOIN "ODS" o ON eo.ods_id = o.id 
LEFT JOIN estatisticas_impacto_empresa est ON eo.empresa_id = est.empresa_id 
WHERE eo.empresa_id = $1 
GROUP BY o.numero, o.nome 
ORDER BY o.numero;
```

## 🔄 Fluxos de Dados Principais

### **Fluxo 1: Criação de Iniciativa**
1. Empresa cria iniciativa (status: RASCUNHO)
2. Define causa, tipo de apoio, vagas, datas
3. Publica iniciativa (status: ATIVA)
4. Colaboradores inscrevem-se
5. Empresa gere inscrições (confirma/rejeita)
6. Iniciativa decorre e é concluída
7. Estatísticas são atualizadas

### **Fluxo 2: Proposta de ONG**
1. ONG envia proposta para empresa
2. Status: PENDENTE
3. Empresa analisa (EM_ANALISE)
4. Empresa responde (APROVADA/REJEITADA)
5. Se aprovada → pode agendar reunião
6. Se aprovada → pode criar iniciativa

### **Fluxo 3: Agendamento de Reunião**
1. Empresa ou ONG agenda reunião
2. Define data, hora, local/link, tipo
3. Status: AGENDADA → CONFIRMADA → REALIZADA
4. Notas podem ser adicionadas após reunião

## 🎯 Métricas do Dashboard

### **KPIs Principais:**
- Total de horas de voluntariado (acumulado e por período)
- Número de projetos/iniciativas (total e ativos)
- Número de voluntários únicos
- Valor de doações (se aplicável)
- Taxa de preenchimento de vagas
- Número de propostas recebidas
- Taxa de aprovação de propostas

### **Filtros Disponíveis:**
- Por período (mês, ano, range customizado)
- Por causa
- Por tipo de apoio
- Por colaborador
- Por ODS
- Por status

## 🔐 Considerações de Segurança

1. **Soft Delete**: Considerar adicionar `deleted_at` para dados sensíveis
2. **Auditoria**: Histórico de alterações em propostas e reuniões
3. **Permissões**: RLS (Row Level Security) por empresa_id
4. **GDPR**: Anonimização de dados de colaboradores inativos

## 🚀 Próximos Passos

1. **Migração**: Criar migration no Prisma
2. **Seed**: Dados de exemplo para testes
3. **API**: Endpoints para CRUD de empresas
4. **Dashboard**: Componentes React para visualizações
5. **Relatórios**: Exportação em PDF/Excel
6. **Notificações**: Sistema de alertas para propostas/reuniões

## 📝 Notas de Implementação

- **Reutiliza**: Tabelas NGO e ODS existentes
- **Compatível**: Não altera estrutura atual
- **Escalável**: Preparado para crescimento
- **Performance**: Índices e views materializadas
- **Flexível**: JSON para metadados extensíveis
