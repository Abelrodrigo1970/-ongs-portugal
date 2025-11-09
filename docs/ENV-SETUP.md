# 🔧 Configuração de Variáveis de Ambiente

## 📋 Variáveis Necessárias

Para o sistema de administração funcionar corretamente, você precisa configurar as seguintes variáveis de ambiente no arquivo `.env.local`:

### 1. Database (já existente)
```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database"
```

### 2. Admin Authentication (NOVAS VARIÁVEIS)
```env
# Chave secreta para assinar tokens JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Senha do administrador
ADMIN_PASSWORD="your-secure-admin-password"
```

### 3. Node Environment
```env
NODE_ENV="development"
```

---

## 🚀 Passo a Passo

### Opção 1: Criar/Editar Manualmente

1. Abra ou crie o arquivo `.env.local` na raiz do projeto
2. Adicione as novas variáveis:

```env
# Database (já deve existir)
DATABASE_URL="postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Admin Authentication (ADICIONE ESTAS LINHAS)
JWT_SECRET="minha-chave-secreta-super-segura-com-pelo-menos-32-caracteres"
ADMIN_PASSWORD="MinhaS3nhaAdm1n2024!"

# Node Environment
NODE_ENV="development"
```

### Opção 2: Copiar do Template

Se criamos um arquivo `.env.example`, você pode copiá-lo:

```bash
cp .env.example .env.local
```

E depois editar os valores.

---

## 🔐 Gerando Valores Seguros

### JWT_SECRET

Use um gerador de strings aleatórias seguras. Exemplos:

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**OpenSSL:**
```bash
openssl rand -hex 64
```

**Online (use com cuidado):**
- https://randomkeygen.com/

### ADMIN_PASSWORD

Crie uma senha forte que:
- Tenha pelo menos 12 caracteres
- Combine letras maiúsculas e minúsculas
- Inclua números e símbolos
- Não seja uma palavra comum

Exemplo de senha forte: `Adm1n#2024$Str0ng!`

---

## ⚠️ IMPORTANTE: Segurança

### ❌ NÃO FAÇA:

1. **Nunca** commite o arquivo `.env.local` para o Git
2. **Nunca** compartilhe suas variáveis de ambiente publicamente
3. **Nunca** use senhas fracas como "admin123" em produção
4. **Nunca** use o JWT_SECRET padrão em produção

### ✅ FAÇA:

1. **Sempre** use valores diferentes para desenvolvimento e produção
2. **Sempre** mantenha backups seguros das suas variáveis de ambiente
3. **Sempre** use senhas fortes e únicas
4. **Sempre** adicione `.env.local` no `.gitignore`

---

## 📝 Verificando a Configuração

### Arquivo .gitignore

Certifique-se de que o `.env.local` está no `.gitignore`:

```gitignore
# local env files
.env*.local
.env.local
```

### Testando as Variáveis

Após configurar, teste o login de admin:

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"MinhaS3nhaAdm1n2024!"}'
```

Se retornar um token, está funcionando! ✅

---

## 🌐 Ambiente de Produção

### Vercel

No painel do Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável:
   - `JWT_SECRET`
   - `ADMIN_PASSWORD`
   - `DATABASE_URL` (se ainda não estiver)

### Netlify

No painel do Netlify:
1. Vá em **Site settings** → **Environment variables**
2. Adicione cada variável com seus valores

### Outras Plataformas

Consulte a documentação da sua plataforma de hospedagem sobre como adicionar variáveis de ambiente.

---

## 🔄 Mudando as Credenciais

Se você precisar alterar a senha de admin:

1. Edite o `.env.local`
2. Altere o valor de `ADMIN_PASSWORD`
3. Reinicie o servidor de desenvolvimento
4. Faça login novamente com a nova senha

**Nota:** Os tokens JWT antigos continuarão válidos por 24h.

---

## 📞 Suporte

Se tiver problemas com as variáveis de ambiente:

1. Verifique se o arquivo `.env.local` está na raiz do projeto
2. Certifique-se de que não há espaços extras nas variáveis
3. Reinicie o servidor após alterar as variáveis
4. Verifique os logs do console para mensagens de erro

---

**Última atualização:** {{ data atual }}

