# 🔧 Configuração Rápida

## ✅ **Problemas corrigidos:**
- ✅ Corrigidos todos os imports de ícones (Heroicons → Lucide React)
- ✅ Adicionada diretiva 'use client' nos componentes necessários
- ✅ Corrigida configuração do Next.js
- ✅ Criados componentes de admin simplificados

## 🚀 **Para executar a aplicação:**

### 1. **Criar arquivo de variáveis de ambiente:**
Crie um arquivo chamado `.env.local` na raiz do projeto com:

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2. **Executar comandos:**

```bash
# 1. Configurar base de dados
npm run db:reset

# 2. Executar aplicação
npm run dev
```

## 🎯 **Resultado esperado:**
- **Site principal:** http://localhost:3000
- **Catálogo ONGs:** http://localhost:3000/ongs
- **Página ODS:** http://localhost:3000/ods
- **Admin:** http://localhost:3000/admin

## 📋 **Funcionalidades disponíveis:**
- ✅ Página inicial com hero e ONGs em destaque
- ✅ Catálogo de ONGs com filtros avançados
- ✅ Páginas de detalhes das ONGs
- ✅ Página dos 17 ODS
- ✅ Painel de administração (modo demonstração)
- ✅ Mapas interativos (Leaflet)
- ✅ Vídeos responsivos (YouTube/Vimeo)
- ✅ Design responsivo e acessível

## 🗄️ **Dados incluídos:**
- 7 ONGs de exemplo
- 17 ODS completos
- 8 tipos de colaboração
- 15 áreas de atuação
