# 🏢 Implementação de Empresas - Instruções

## ⚠️ Importante: Criar Tabelas no Supabase

As tabelas de Empresas precisam ser criadas manualmente no Supabase devido a limitações do Prisma com enums PostgreSQL.

### **📋 Passo a Passo:**

#### **1. Aceder ao Supabase SQL Editor**
1. Vá para https://supabase.com/dashboard
2. Selecione o projeto
3. Vá para "SQL Editor"
4. Clique em "New query"

#### **2. Executar o SQL**
Copie e cole o conteúdo completo do ficheiro `database-schema-empresas.sql` e execute.

Ou execute os comandos em partes:

**Parte 1: ENUMS**
```sql
CREATE TYPE status_iniciativa AS ENUM ('RASCUNHO', 'ATIVA', 'PAUSADA', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE status_proposta AS ENUM ('PENDENTE', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'ARQUIVADA');
CREATE TYPE status_reuniao AS ENUM ('AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA', 'REMARCADA');
CREATE TYPE status_inscricao AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA');
CREATE TYPE tipo_apoio_enum AS ENUM ('TEMPO_VOLUNTARIADO', 'CONHECIMENTO_CAPACITACAO', 'RECURSOS_SERVICOS', 'PRODUTOS_BENS');
CREATE TYPE formato_relatorio AS ENUM ('PDF', 'EXCEL', 'CSV', 'JSON');
CREATE TYPE tipo_reuniao_enum AS ENUM ('PRESENCIAL', 'ONLINE', 'HIBRIDA');
```

**Parte 2: Tabelas Principais** (executar todo o CREATE TABLE do ficheiro SQL)

**Parte 3: Índices** (executar todos os CREATE INDEX)

**Parte 4: Views Materializadas** (executar os CREATE MATERIALIZED VIEW)

**Parte 5: Triggers** (executar os CREATE TRIGGER)

#### **3. Seed de Dados**
Após criar as tabelas, execute:
```bash
$env:DATABASE_URL="postgresql://..."; node scripts/setup-empresas-db.js
```

### **✅ Verificar Instalação**

```bash
# Testar se as tabelas foram criadas
$env:DATABASE_URL="postgresql://..."; node -e "
import { prisma } from './lib/db.js';
async function test() {
  const count = await prisma.empresa.count();
  console.log('Empresas na base de dados:', count);
  await prisma.\$disconnect();
}
test();
"
```

## 🎯 Funcionalidades Disponíveis Após Setup

### **Páginas:**
- `/empresas` - Listagem de empresas
- `/empresas/[id]` - Perfil da empresa

### **Componentes:**
- `EmpresaCard` - Card de empresa
- `FeaturedEmpresas` - Secção na homepage

### **API:**
- `/api/empresas` - Busca de empresas

### **Navegação:**
- Link "Empresas" no header principal

## 📊 Estrutura Criada

```
✓ 12 Tabelas novas
✓ 7 Enums
✓ 7 Índices otimizados
✓ 2 Views materializadas
✓ Triggers para updated_at
✓ Relações com NGO e ODS existentes
```

## 🔧 Troubleshooting

### **Erro: "table does not exist"**
→ Execute o SQL no Supabase primeiro

### **Erro: "enum already exists"**
→ Normal se re-executar, pode ignorar

### **Erro: "prepared statement"**
→ Execute os comandos em partes menores no SQL Editor

## 📝 Próximos Desenvolvimentos

- [ ] Dashboard da empresa com gráficos
- [ ] Gestão de iniciativas (CRUD)
- [ ] Sistema de propostas
- [ ] Agendamento de reuniões
- [ ] Exportação de relatórios
- [ ] Notificações

## 🎉 Resumo

A estrutura de código está completa! Apenas falta executar o SQL no Supabase para criar as tabelas e depois executar o script de seed para ter dados de exemplo.
