# Configuração das Variáveis de Ambiente na Vercel

## ⚠️ IMPORTANTE: Configure as variáveis de ambiente na Vercel

Para que a aplicação funcione corretamente, você precisa configurar as seguintes variáveis de ambiente no painel da Vercel:

### 1. Acesse o painel da Vercel
- Vá para: https://vercel.com/dashboard
- Selecione o projeto: `ongs-portugal`

### 2. Configure as variáveis de ambiente
Vá para: **Settings** → **Environment Variables**

Adicione as seguintes variáveis:

#### DATABASE_URL
```
postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### DIRECT_URL
```
postgresql://postgres.zdgcstskzmkluylxfymb:eDcMlmRSjLxnpzgp@aws-1-eu-west-2.pooler.supabase.com:5432/postgres
```

#### NEXT_PUBLIC_SUPABASE_URL
```
https://zdgcstskzmkluylxfymb.supabase.co
```

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZ2NzdHNrem1rbHV5bHhmeW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NzA1NTAsImV4cCI6MjA3NDE0NjU1MH0.KxDlxTdU3WMpATSeNjgU5RuHp0PSq8er8kssnl427rc
```

### 3. Aplique para todos os ambientes
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4. Faça um novo deploy
Após configurar as variáveis, faça um novo deploy para aplicar as mudanças.

## 🔍 Como verificar se está funcionando
1. Acesse: https://ongs-portugal.vercel.app
2. Verifique se a página carrega sem erros
3. Teste a navegação entre páginas
4. Verifique se os dados aparecem corretamente
