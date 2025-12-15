# 📋 Instruções para Criar Tabela de Inscrições

## ⚠️ Situação Atual

Você tem apenas a tabela `inscricoes_iniciativa` no Supabase, mas o sistema precisa da tabela `inscricoes` que serve tanto para **eventos** quanto para **iniciativas**.

## 📋 Passo a Passo Completo

### 1. Acessar o Supabase SQL Editor

1. Vá para: https://supabase.com/dashboard
2. Selecione o projeto
3. Vá para: **SQL Editor**
4. Clique em: **New query**

### 2. Executar o Script Completo

Execute o arquivo `scripts/add-unique-inscricao-constraint.sql` completo. Ele vai:

1. ✅ Criar o enum `status_inscricao` (se não existir)
2. ✅ Criar a tabela `inscricoes` (se não existir)
3. ✅ Criar índices básicos
4. ✅ Criar trigger para `updated_at`
5. ✅ Remover duplicatas existentes
6. ✅ Adicionar constraint única para prevenir colaboradores repetidos

### 3. Verificar se Funcionou

Após executar, você deve ver:

```
✅ Tabela inscricoes criada
✅ Índices criados
✅ Trigger criado
✅ Constraint única aplicada
```

### 4. Verificar a Tabela

```sql
-- Ver estrutura da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'inscricoes'
ORDER BY ordinal_position;
```

### 5. Testar a Constraint

```sql
-- Tentar inserir uma duplicata (deve falhar)
-- Primeiro, pegue um evento_id e email existente
SELECT evento_id, email_colaborador 
FROM inscricoes 
WHERE evento_id IS NOT NULL 
LIMIT 1;

-- Tente inserir novamente (deve falhar)
INSERT INTO inscricoes (
  evento_id, 
  nome_colaborador, 
  email_colaborador, 
  status
) VALUES (
  'seu-event-id-aqui',
  'Teste Duplicado',
  'mesmo-email@example.com',
  'PENDENTE'
);
-- Este INSERT deve falhar com erro de constraint única
```

## 📝 Notas Importantes

- A tabela `inscricoes_iniciativa` pode continuar existindo (ela não interfere)
- A nova tabela `inscricoes` é a que será usada pelo sistema
- A constraint única só se aplica a **eventos** (não afeta iniciativas diretamente)
- O email é normalizado automaticamente (lowercase + trim) antes de verificar

## 🔄 Migração de Dados (Opcional)

Se você quiser migrar dados da tabela antiga `inscricoes_iniciativa` para a nova `inscricoes`, você precisará de um script separado. Por enquanto, a nova tabela estará vazia e será preenchida conforme as novas inscrições forem criadas.

## ✅ Próximos Passos

Após executar o SQL:

1. **Gerar Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Testar a aplicação**:
   - Criar uma inscrição em um evento
   - Tentar criar a mesma inscrição novamente (deve falhar)
   - Verificar se as vagas são contadas corretamente

