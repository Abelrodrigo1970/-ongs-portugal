# 📋 Como Ver os Campos de uma Tabela no Supabase

## 🚀 Método Rápido (Recomendado)

### 1. No Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para: **Table Editor** (menu lateral)
4. Clique na tabela `inscricoes`
5. Você verá todos os campos, tipos e propriedades

## 🔧 Método SQL (Mais Detalhado)

### 1. Acessar SQL Editor

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para: **SQL Editor**
4. Clique em: **New query**

### 2. Executar Query

**Opção Simples:**
```sql
SELECT 
  column_name as "Nome",
  data_type as "Tipo",
  is_nullable as "Null?",
  column_default as "Padrão"
FROM information_schema.columns
WHERE table_name = 'inscricoes'
ORDER BY ordinal_position;
```

**Opção Completa (com constraints):**
```sql
SELECT 
  c.column_name as "Coluna",
  c.data_type as "Tipo",
  c.is_nullable as "Null?",
  c.column_default as "Padrão",
  tc.constraint_type as "Constraint"
FROM information_schema.columns c
LEFT JOIN information_schema.key_column_usage kcu 
  ON c.table_name = kcu.table_name 
  AND c.column_name = kcu.column_name
LEFT JOIN information_schema.table_constraints tc 
  ON kcu.constraint_name = tc.constraint_name
WHERE c.table_name = 'inscricoes'
ORDER BY c.ordinal_position;
```

**Ver Índices:**
```sql
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'inscricoes';
```

## 📝 O Que Você Deve Ver na Tabela `inscricoes`

Se a tabela foi criada corretamente, você deve ver:

| Coluna | Tipo | Null? | Descrição |
|--------|------|-------|-----------|
| `id` | TEXT | NOT NULL | Primary Key |
| `evento_id` | TEXT | NULL | FK para Event |
| `iniciativa_id` | TEXT | NULL | FK para Iniciativa |
| `nome_colaborador` | TEXT | NOT NULL | Nome do colaborador |
| `email_colaborador` | TEXT | NOT NULL | Email (normalizado) |
| `telefone` | TEXT | NULL | Telefone (opcional) |
| `mensagem` | TEXT | NULL | Mensagem (opcional) |
| `status` | status_inscricao | NOT NULL | Enum: PENDENTE, APROVADA, REJEITADA, CANCELADA |
| `created_at` | TIMESTAMP | NOT NULL | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL | Data de atualização |

## 🔍 Verificar Constraint Única

Para verificar se a constraint única foi criada:

```sql
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'inscricoes'
  AND indexname = 'idx_inscricoes_evento_email_unique';
```

Você deve ver o índice único na combinação `(evento_id, LOWER(TRIM(email_colaborador)))`.

## ⚠️ Problemas Comuns

### Tabela não aparece
```sql
-- Verificar se existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'inscricoes';
```

### Ver todas as tabelas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

## 🎯 Script Completo

Execute o arquivo `scripts/ver-estrutura-tabela.sql` no SQL Editor do Supabase para ver todas as informações de uma vez!

