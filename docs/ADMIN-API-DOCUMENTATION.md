# 🔐 Documentação da API de Administração

## 📋 Índice
- [Configuração](#configuração)
- [Autenticação](#autenticação)
- [API de ONGs](#api-de-ongs)
- [API de Eventos](#api-de-eventos)
- [Códigos de Status](#códigos-de-status)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🔧 Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Database (já deve existir)
DATABASE_URL="postgresql://usuario:senha@host:porta/database"

# Admin Authentication (NOVAS VARIÁVEIS)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ADMIN_PASSWORD="your-secure-admin-password"

# Node Environment
NODE_ENV="development"
```

⚠️ **IMPORTANTE:**
- Altere o `JWT_SECRET` para uma chave secreta forte e única
- Altere o `ADMIN_PASSWORD` para uma senha segura
- Nunca commite o arquivo `.env.local` para o repositório

---

## 🔑 Autenticação

### Login de Admin

Antes de usar qualquer endpoint da API de administração, você precisa fazer login para obter um token JWT.

**Endpoint:** `POST /api/admin/login`

**Body:**
```json
{
  "password": "your-secure-admin-password"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

**Resposta de Erro (401):**
```json
{
  "error": "Senha incorreta"
}
```

### Usando o Token

Todos os endpoints de administração requerem o token JWT no header de autorização:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🏢 API de ONGs

### 1. Listar ONGs

**Endpoint:** `GET /api/admin/ngos`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `query` (opcional): Texto para busca
- `visivel` (opcional): `true` ou `false` para filtrar visibilidade
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Items por página (padrão: 50)

**Exemplo de Requisição:**
```
GET /api/admin/ngos?page=1&limit=10&query=ambiente
```

**Resposta (200):**
```json
{
  "success": true,
  "ngos": [
    {
      "id": "clxxx123",
      "nome": "Verde Portugal",
      "descricao": "ONG ambiental...",
      "email": "info@verdeportugal.pt",
      "visivel": true,
      "ods": [...],
      "areaAtuacao": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 2. Buscar ONG por ID

**Endpoint:** `GET /api/admin/ngos/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "nome": "Verde Portugal",
    "descricao": "ONG focada em sustentabilidade...",
    "missao": "Proteger o ambiente...",
    "email": "info@verdeportugal.pt",
    "telefone": "+351 21 123 4567",
    "localizacao": "Lisboa, Portugal",
    "latitude": 38.7223,
    "longitude": -9.1393,
    "impacto": "[\"50.000 árvores plantadas\"]",
    "imagem": "https://...",
    "logo": "https://...",
    "instagramUrl": "https://instagram.com/verdeportugal",
    "videoUrl": null,
    "websiteUrl": "https://verdeportugal.pt",
    "visivel": true,
    "ods": [
      {
        "id": "...",
        "ods": {
          "id": "...",
          "numero": 15,
          "nome": "Vida terrestre"
        }
      }
    ],
    "areaAtuacao": [...],
    "colaboracao": [...]
  }
}
```

---

### 3. Criar Nova ONG

**Endpoint:** `POST /api/admin/ngos`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (campos obrigatórios):**
```json
{
  "nome": "Nova ONG",
  "descricao": "Descrição detalhada da ONG",
  "missao": "Missão e propósito da ONG",
  "email": "contato@novaong.pt",
  "telefone": "+351 21 123 4567",
  "localizacao": "Lisboa, Portugal",
  "impacto": ["Impacto 1", "Impacto 2", "Impacto 3"]
}
```

**Body (campos opcionais):**
```json
{
  "latitude": 38.7223,
  "longitude": -9.1393,
  "imagem": "https://exemplo.com/imagem.jpg",
  "logo": "https://exemplo.com/logo.png",
  "instagramUrl": "https://instagram.com/novaong",
  "videoUrl": "https://youtube.com/watch?v=...",
  "websiteUrl": "https://novaong.pt",
  "visivel": true,
  "ods": ["ods-id-1", "ods-id-2"],
  "areas": ["area-id-1", "area-id-2"],
  "colaboracao": ["colab-id-1"]
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "clyyy456",
    "nome": "Nova ONG",
    ...
  }
}
```

---

### 4. Atualizar ONG

**Endpoint:** `PUT /api/admin/ngos/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** (todos os campos são opcionais)
```json
{
  "nome": "Nome Atualizado",
  "descricao": "Nova descrição",
  "visivel": false,
  "ods": ["novo-ods-id"],
  "areas": ["nova-area-id"]
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "nome": "Nome Atualizado",
    ...
  }
}
```

---

### 5. Deletar ONG

**Endpoint:** `DELETE /api/admin/ngos/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "ONG deletada com sucesso"
}
```

---

### 6. Toggle Visibilidade da ONG

**Endpoint:** `PATCH /api/admin/ngos/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "nome": "Verde Portugal",
    "visivel": false,
    ...
  }
}
```

---

## 📅 API de Eventos

### 1. Listar Eventos

**Endpoint:** `GET /api/admin/events`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `query` (opcional): Texto para busca
- `visivel` (opcional): `true` ou `false`
- `ngoId` (opcional): Filtrar por ONG específica
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Items por página (padrão: 50)

**Resposta (200):**
```json
{
  "success": true,
  "events": [
    {
      "id": "clevt123",
      "nome": "Plantação de Árvores",
      "descricao": "Evento de reflorestação...",
      "dataInicio": "2024-12-15T09:00:00.000Z",
      "dataFim": "2024-12-15T17:00:00.000Z",
      "localizacao": "Sintra, Portugal",
      "tipo": "PRESENCIAL",
      "inscricoesAbertas": true,
      "visivel": true,
      "ngo": {
        "id": "...",
        "nome": "Verde Portugal"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 3,
    "total": 28,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. Buscar Evento por ID

**Endpoint:** `GET /api/admin/events/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "clevt123",
    "nome": "Plantação de Árvores",
    "descricao": "Junte-se a nós para plantar árvores nativas...",
    "dataInicio": "2024-12-15T09:00:00.000Z",
    "dataFim": "2024-12-15T17:00:00.000Z",
    "localizacao": "Parque Florestal de Sintra",
    "latitude": 38.8029,
    "longitude": -9.3817,
    "tipo": "PRESENCIAL",
    "maxParticipantes": 100,
    "inscricoesAbertas": true,
    "linkInscricao": "https://...",
    "linkEvento": null,
    "imagem": "https://...",
    "ngoId": "clxxx123",
    "visivel": true,
    "ngo": {...},
    "ods": [...],
    "areas": [...]
  }
}
```

---

### 3. Criar Novo Evento

**Endpoint:** `POST /api/admin/events`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (campos obrigatórios):**
```json
{
  "nome": "Novo Evento",
  "descricao": "Descrição do evento",
  "ngoId": "id-da-ong",
  "dataInicio": "2024-12-01T09:00:00Z",
  "localizacao": "Lisboa, Portugal"
}
```

**Body (campos opcionais):**
```json
{
  "dataFim": "2024-12-01T17:00:00Z",
  "latitude": 38.7223,
  "longitude": -9.1393,
  "tipo": "PRESENCIAL",
  "maxParticipantes": 50,
  "inscricoesAbertas": true,
  "linkInscricao": "https://...",
  "linkEvento": "https://...",
  "imagem": "https://...",
  "visivel": true,
  "ods": ["ods-id-1", "ods-id-2"],
  "areas": ["area-id-1"]
}
```

**Tipos de Evento:**
- `PRESENCIAL`
- `REMOTO`
- `HIBRIDO`

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "clevt456",
    "nome": "Novo Evento",
    ...
  }
}
```

---

### 4. Atualizar Evento

**Endpoint:** `PUT /api/admin/events/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** (todos os campos são opcionais)
```json
{
  "nome": "Nome Atualizado",
  "dataInicio": "2024-12-10T10:00:00Z",
  "inscricoesAbertas": false,
  "ods": ["novo-ods-id"],
  "areas": ["nova-area-id"]
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "clevt123",
    "nome": "Nome Atualizado",
    ...
  }
}
```

---

### 5. Deletar Evento

**Endpoint:** `DELETE /api/admin/events/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Evento deletado com sucesso"
}
```

---

### 6. Toggle Visibilidade do Evento

**Endpoint:** `PATCH /api/admin/events/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "clevt123",
    "nome": "Plantação de Árvores",
    "visivel": false,
    ...
  }
}
```

---

## 📊 Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Erro de validação |
| 401 | Não autorizado (token inválido ou ausente) |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

## 💡 Exemplos de Uso

### Exemplo completo com cURL

#### 1. Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-secure-admin-password"}'
```

#### 2. Listar ONGs
```bash
curl -X GET "http://localhost:3000/api/admin/ngos?page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 3. Criar ONG
```bash
curl -X POST http://localhost:3000/api/admin/ngos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Oceano Limpo",
    "descricao": "ONG dedicada à limpeza dos oceanos",
    "missao": "Proteger a vida marinha através da limpeza dos oceanos",
    "email": "contato@oceanolimpo.pt",
    "telefone": "+351 21 999 8888",
    "localizacao": "Porto, Portugal",
    "impacto": ["100 toneladas de lixo removidas", "50 praias limpas"],
    "ods": ["ods-id-14"],
    "areas": ["area-ambiente-id"]
  }'
```

#### 4. Criar Evento
```bash
curl -X POST http://localhost:3000/api/admin/events \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Limpeza da Praia",
    "descricao": "Evento de limpeza da praia de Cascais",
    "ngoId": "id-da-ong",
    "dataInicio": "2024-12-20T09:00:00Z",
    "dataFim": "2024-12-20T13:00:00Z",
    "localizacao": "Praia de Cascais, Portugal",
    "tipo": "PRESENCIAL",
    "maxParticipantes": 50,
    "inscricoesAbertas": true
  }'
```

#### 5. Atualizar visibilidade
```bash
curl -X PATCH http://localhost:3000/api/admin/ngos/clxxx123 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 6. Deletar Evento
```bash
curl -X DELETE http://localhost:3000/api/admin/events/clevt123 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

### Exemplo com JavaScript (Fetch API)

```javascript
// 1. Login e obter token
async function loginAdmin() {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password: 'your-secure-admin-password'
    })
  });
  
  const data = await response.json();
  return data.token;
}

// 2. Listar ONGs
async function listNGOs(token) {
  const response = await fetch('/api/admin/ngos?page=1&limit=10', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data.ngos);
}

// 3. Criar ONG
async function createNGO(token, ngoData) {
  const response = await fetch('/api/admin/ngos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ngoData)
  });
  
  const data = await response.json();
  return data;
}

// Uso
const token = await loginAdmin();
await listNGOs(token);
```

---

## 🔒 Segurança

### Boas Práticas

1. **Nunca compartilhe seu token JWT**
2. **Altere as senhas padrão**
3. **Use HTTPS em produção**
4. **Guarde o JWT_SECRET seguramente**
5. **O token expira em 24h** - faça login novamente quando necessário
6. **Não commite arquivos .env.local** no Git

### Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

---

## 📝 Notas Adicionais

### IDs Relacionais

Para obter os IDs de ODS, Áreas de Atuação e Tipos de Colaboração, você pode:

1. Consultar diretamente no banco de dados
2. Usar as APIs públicas existentes:
   - `GET /api/ods`
   - `GET /api/areas` (se existir)
   - `GET /api/colaboracao` (se existir)

### Formato de Datas

Todas as datas devem estar no formato ISO 8601:
```
2024-12-01T09:00:00Z
```

### Array de Impacto

O campo `impacto` pode ser enviado como array:
```json
{
  "impacto": ["Impacto 1", "Impacto 2", "Impacto 3"]
}
```

Ele será automaticamente convertido para string JSON no banco de dados.

---

## 🎯 Próximos Passos

Após configurar e testar as APIs:

1. ✅ Configure as variáveis de ambiente
2. ✅ Teste o login de admin
3. ✅ Teste a criação de uma ONG
4. ✅ Teste a criação de um evento
5. ✅ Implemente um painel de administração frontend (opcional)

---

**Documentação criada em:** {{ data atual }}
**Versão da API:** 1.0.0

