# ⚡ Setup Rápido - Empresas

## 🎯 Executar no Supabase SQL Editor

### **Passo 1: Criar ENUMs**
Execute o ficheiro `create-enums.sql` no Supabase:

```sql
-- Copiar e colar todo o conteúdo de create-enums.sql
```

### **Passo 2: Verificar se ENUMs foram criados**
```sql
SELECT typname FROM pg_type WHERE typtype = 'e' ORDER BY typname;
```

Deve mostrar:
- EventTipo
- FormatoRelatorio
- StatusIniciativa  
- StatusInscricao
- StatusProposta
- StatusReuniao
- TipoApoio
- TipoReuniao

### **Passo 3: Executar seed no terminal**
```bash
$env:DATABASE_URL="postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"; node scripts/setup-empresas-db.js
```

### **Passo 4: Verificar no navegador**
```
http://localhost:3002/empresas
```

## ✅ O que vai ter após o setup:

- **2 Empresas** de exemplo:
  - TechForGood Portugal (Lisboa)
  - GreenBusiness Solutions (Porto)

- **4 Causas**:
  - Educação
  - Ambiente
  - Saúde
  - Inclusão Social

- **4 Tipos de Apoio**:
  - Voluntariado Presencial
  - Formação e Capacitação
  - Consultoria Pro Bono
  - Doação de Produtos

- **2 Iniciativas** ativas
- **Estatísticas** de impacto
- **Associações** com ODS

## 🔧 Troubleshooting

### Se der erro "type does not exist":
→ Execute o create-enums.sql primeiro no Supabase

### Se der erro "table does not exist":
→ Execute o database-schema-empresas.sql primeiro no Supabase

### Para limpar e recomeçar:
```sql
DROP TABLE IF EXISTS exportacoes_relatorios CASCADE;
DROP TABLE IF EXISTS reunioes CASCADE;
DROP TABLE IF EXISTS propostas CASCADE;
DROP TABLE IF EXISTS favoritos CASCADE;
DROP TABLE IF EXISTS inscricoes_iniciativa CASCADE;
DROP TABLE IF EXISTS iniciativas CASCADE;
DROP TABLE IF EXISTS colaboradores CASCADE;
DROP TABLE IF EXISTS estatisticas_impacto_empresa CASCADE;
DROP TABLE IF EXISTS empresa_causas CASCADE;
DROP TABLE IF EXISTS empresa_ods CASCADE;
DROP TABLE IF EXISTS empresa_tipos_apoio CASCADE;
DROP TABLE IF EXISTS tipos_apoio_empresa CASCADE;
DROP TABLE IF EXISTS causas CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;

DROP TYPE IF EXISTS TipoReuniao CASCADE;
DROP TYPE IF EXISTS FormatoRelatorio CASCADE;
DROP TYPE IF EXISTS TipoApoio CASCADE;
DROP TYPE IF EXISTS StatusInscricao CASCADE;
DROP TYPE IF EXISTS StatusReuniao CASCADE;
DROP TYPE IF EXISTS StatusProposta CASCADE;
DROP TYPE IF EXISTS StatusIniciativa CASCADE;
```
