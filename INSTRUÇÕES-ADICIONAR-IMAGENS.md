# 📸 Como Adicionar Imagens às ONGs

## Problema
As ONGs que não têm o campo `imagem` preenchido não mostram a imagem de fundo (hero image) no topo da página individual.

## Solução Rápida - Via Prisma Studio

### 1️⃣ Abrir Prisma Studio
```bash
npx prisma studio
```

### 2️⃣ Navegar para a tabela `NGO`

### 3️⃣ Para cada ONG sem imagem:
1. Clica na linha da ONG
2. No campo `imagem`, adiciona uma destas URLs:

**Imagens por categoria:**

#### 🌍 **Ambiente / Conservação**
```
https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80
```

#### 🏥 **Saúde**
```
https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format
```

#### 📚 **Educação / Formação**
```
https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=entropy&auto=format
```

#### 🤝 **Inclusão Social / Sem Abrigo / Ação Social**
```
https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop
```

#### ⚖️ **Direitos Humanos**
```
https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&crop=entropy&auto=format
```

#### 🎨 **Cultura**
```
https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop
```

#### 🍽️ **Segurança Alimentar**
```
https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop
```

#### **Padrão (para qualquer área)**
```
https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop
```

### 4️⃣ Guardar
Clica em "Save 1 change" para cada ONG

---

## Solução Automática - Via SQL (Mais Rápido)

### Se tiveres acesso direto ao PostgreSQL:

```sql
-- Atualizar TODAS as ONGs sem imagem com uma imagem padrão
UPDATE "NGO" 
SET "imagem" = 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop'
WHERE ("imagem" IS NULL OR "imagem" = '');
```

**Ou usa o script completo:** `scripts/add-images-sql.sql`

---

## Verificar Resultado

1. Vai a uma página individual de ONG: `http://localhost:3000/ongs/[id]`
2. Deves ver a imagem de fundo (hero) no topo da página! 🎉

---

## ✅ Depois de adicionar as imagens:

Todas as ONGs vão ter uma bonita imagem de fundo no topo da página, tal como a CAIS tem!

