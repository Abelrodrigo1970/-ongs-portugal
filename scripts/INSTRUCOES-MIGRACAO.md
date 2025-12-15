# 🔧 Instruções para Adicionar Constraint Única de Inscrições

## ⚠️ Importante

Como o banco de dados já está em produção e as tabelas já existem, vamos adicionar a constraint única diretamente via SQL no Supabase.

## 📋 Passo a Passo

### 1. Acessar o Supabase SQL Editor

1. Vá para: https://supabase.com/dashboard
2. Selecione o projeto: `zdgcstskzmkluylxfymb`
3. Vá para: **SQL Editor**
4. Clique em: **New query**

### 2. Verificar Duplicatas (Opcional mas Recomendado)

Antes de adicionar a constraint, verifique se existem duplicatas:

```sql
-- Verificar duplicatas
SELECT 
  evento_id, 
  LOWER(TRIM(email_colaborador)) as email_normalizado,
  COUNT(*) as total
FROM inscricoes
WHERE evento_id IS NOT NULL
GROUP BY evento_id, LOWER(TRIM(email_colaborador))
HAVING COUNT(*) > 1;
```

Se houver duplicatas, remova-as mantendo apenas a mais recente:

```sql
-- Remover duplicatas, mantendo apenas a inscrição mais recente
DELETE FROM inscricoes
WHERE id NOT IN (
  SELECT DISTINCT ON (evento_id, LOWER(TRIM(email_colaborador))) id
  FROM inscricoes
  WHERE evento_id IS NOT NULL
  ORDER BY evento_id, LOWER(TRIM(email_colaborador)), created_at DESC
);
```

### 3. Adicionar Constraint Única

Copie e execute o script completo do arquivo `scripts/add-unique-inscricao-constraint.sql`:

```sql
-- Criar índice único para prevenir colaboradores repetidos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_inscricoes_evento_email_unique'
  ) THEN
    CREATE UNIQUE INDEX idx_inscricoes_evento_email_unique 
    ON inscricoes(evento_id, LOWER(TRIM(email_colaborador)))
    WHERE evento_id IS NOT NULL;
    
    RAISE NOTICE 'Índice único criado com sucesso';
  ELSE
    RAISE NOTICE 'Índice único já existe';
  END IF;
END $$;
```

### 4. Verificar se Funcionou

```sql
-- Verificar se o índice foi criado
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'inscricoes' 
AND indexname = 'idx_inscricoes_evento_email_unique';
```

### 5. Testar a Constraint

```sql
-- Tentar inserir uma duplicata (deve falhar)
INSERT INTO inscricoes (
  id, 
  evento_id, 
  nome_colaborador, 
  email_colaborador, 
  status, 
  created_at, 
  updated_at
) VALUES (
  'test-duplicate-123',
  (SELECT evento_id FROM inscricoes WHERE evento_id IS NOT NULL LIMIT 1),
  'Teste',
  (SELECT LOWER(TRIM(email_colaborador)) FROM inscricoes WHERE evento_id IS NOT NULL LIMIT 1),
  'PENDENTE',
  NOW(),
  NOW()
);
-- Este INSERT deve falhar com erro de constraint única
```

## ✅ Próximos Passos

Após executar o SQL:

1. **Atualizar o Prisma Schema** - Já foi feito (constraint adicionada)
2. **Gerar Prisma Client**:
   ```bash
   npx prisma generate
   ```
3. **Testar a aplicação** - Tentar criar inscrição duplicada deve falhar

## 📝 Notas

- O índice único usa `LOWER(TRIM(email_colaborador))` para garantir que emails em diferentes casos não sejam considerados diferentes
- A constraint só se aplica quando `evento_id IS NOT NULL` (não afeta iniciativas)
- O código já normaliza emails antes de inserir, então isso é apenas uma camada extra de proteção

