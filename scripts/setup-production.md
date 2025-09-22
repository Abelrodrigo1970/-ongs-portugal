# 🚀 Setup Produção - Supabase + Vercel

## 📋 Variáveis de ambiente necessárias:

### Para Vercel (Environment Variables):
```
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
NEXT_PUBLIC_SITE_URL=https://[seu-app].vercel.app
```

## 🔧 Passos após criar projeto Supabase:

1. **No Supabase Dashboard:**
   - Settings → Database → Connection string
   - Copia a "URI" (postgresql://...)
   
2. **No Vercel Dashboard:**
   - Settings → Environment Variables
   - Adiciona DATABASE_URL com valor do Supabase
   - Adiciona NEXT_PUBLIC_SITE_URL com teu domínio Vercel

3. **Redeploy automático** acontece após adicionar env vars

## ✅ Código já preparado para produção:
- ✅ Schema PostgreSQL configurado
- ✅ Build script com prisma generate + push
- ✅ Seed data pronto
- ✅ Next.js otimizado
