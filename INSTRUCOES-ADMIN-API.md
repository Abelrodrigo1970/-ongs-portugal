# 🚀 INÍCIO RÁPIDO - API de Administração

## ⚡ Setup em 3 Passos

### 1. Configure as Variáveis de Ambiente

Abra o arquivo `.env.local` (ou crie se não existir) e adicione:

```env
JWT_SECRET="minha-chave-secreta-super-forte-12345678901234567890"
ADMIN_PASSWORD="Admin#2024Seguro!"
```

### 2. Inicie o Servidor

```bash
npm run dev
```

### 3. Teste o Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"Admin#2024Seguro!"}'
```

✅ Se recebeu um token, está funcionando!

---

## 📝 Comandos Úteis

### Fazer Login e Salvar Token (Linux/Mac)
```bash
export TOKEN=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"Admin#2024Seguro!"}' | jq -r '.token')

echo $TOKEN
```

### Fazer Login (Windows PowerShell)
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" -Method POST -ContentType "application/json" -Body '{"password":"Admin#2024Seguro!"}'
$TOKEN = $response.token
echo $TOKEN
```

### Listar ONGs
```bash
curl -X GET "http://localhost:3000/api/admin/ngos" \
  -H "Authorization: Bearer $TOKEN"
```

### Listar Eventos
```bash
curl -X GET "http://localhost:3000/api/admin/events" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Documentação Completa

- **API Detalhada:** [`docs/ADMIN-API-DOCUMENTATION.md`](docs/ADMIN-API-DOCUMENTATION.md)
- **Setup Completo:** [`docs/ADMIN-BACKEND-SETUP-COMPLETO.md`](docs/ADMIN-BACKEND-SETUP-COMPLETO.md)
- **Configuração:** [`docs/ENV-SETUP.md`](docs/ENV-SETUP.md)

---

## 🎯 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/admin/login` | Login |
| GET | `/api/admin/ngos` | Listar ONGs |
| POST | `/api/admin/ngos` | Criar ONG |
| PUT | `/api/admin/ngos/{id}` | Atualizar ONG |
| DELETE | `/api/admin/ngos/{id}` | Deletar ONG |
| GET | `/api/admin/events` | Listar Eventos |
| POST | `/api/admin/events` | Criar Evento |
| PUT | `/api/admin/events/{id}` | Atualizar Evento |
| DELETE | `/api/admin/events/{id}` | Deletar Evento |

**Todos os endpoints (exceto login) requerem:** `Authorization: Bearer {token}`

---

## 🎉 Pronto para usar!

Tudo está funcionando. Basta configurar as variáveis de ambiente e começar a usar! 🚀

