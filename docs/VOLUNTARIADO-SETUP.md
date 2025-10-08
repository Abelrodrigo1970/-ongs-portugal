# 🤝 Sistema de Voluntariado e Inscrições

## 📋 Visão Geral

O sistema de voluntariado permite que cidadãos interessados se autentiquem de forma simples e se inscrevam em eventos organizados por ONGs e iniciativas empresariais.

## 🎯 Funcionalidades Implementadas

### 1. Autenticação Simples de Voluntários
- ✅ Login sem senha (apenas nome e email)
- ✅ Dados armazenados no localStorage
- ✅ Sessão persistente entre páginas
- ✅ Botão de "Voluntário" no header
- ✅ Perfil do voluntário no header quando autenticado

### 2. Dashboard do Voluntário (`/voluntariado`)
- ✅ Página personalizada com saudação
- ✅ Quick actions para explorar ONGs, Eventos e Empresas
- ✅ Lista de eventos disponíveis com botão de inscrição
- ✅ Lista de iniciativas empresariais com botão de inscrição
- ✅ Botão de logout

### 3. Sistema de Inscrições
- ✅ Modal de inscrição unificado para eventos e iniciativas
- ✅ Formulário com nome, email, telefone e mensagem
- ✅ Validação de campos obrigatórios
- ✅ Verificação de inscrições duplicadas
- ✅ Estados de loading e success
- ✅ Auto-preenchimento com dados do voluntário autenticado

### 4. Cards Atualizados
- ✅ `EventCard` com prop `showInscricao`
- ✅ `IniciativaCard` com prop `showInscricao`
- ✅ Botões "Inscrever-me" nos cards
- ✅ Modal de inscrição integrado

## 🗄️ Modelo de Dados

### Tabela: `inscricoes`

```sql
CREATE TABLE inscricoes (
  id TEXT PRIMARY KEY,
  evento_id TEXT REFERENCES "Event"(id) ON DELETE CASCADE,
  iniciativa_id TEXT REFERENCES iniciativas(id) ON DELETE CASCADE,
  nome_colaborador TEXT NOT NULL,
  email_colaborador TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  status status_inscricao DEFAULT 'PENDENTE' NOT NULL,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL
);
```

### Enum: `status_inscricao`
- `PENDENTE` - Inscrição recebida, aguardando aprovação
- `APROVADA` - Inscrição aceite
- `REJEITADA` - Inscrição recusada
- `CANCELADA` - Voluntário cancelou a inscrição

## 🚀 Setup do Sistema

### 1. Executar SQL no Supabase

Execute o script SQL para criar a tabela de inscrições:

```bash
# O script está em: scripts/add-inscricoes-table.sql
```

**Copie e execute no SQL Editor do Supabase:**

```sql
-- Criar enum
CREATE TYPE status_inscricao AS ENUM (
  'PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA'
);

-- Criar tabela
CREATE TABLE inscricoes (
  id TEXT PRIMARY KEY,
  evento_id TEXT REFERENCES "Event"(id) ON DELETE CASCADE,
  iniciativa_id TEXT REFERENCES iniciativas(id) ON DELETE CASCADE,
  nome_colaborador TEXT NOT NULL,
  email_colaborador TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  status status_inscricao DEFAULT 'PENDENTE' NOT NULL,
  created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL,
  CONSTRAINT check_evento_ou_iniciativa CHECK (
    (evento_id IS NOT NULL AND iniciativa_id IS NULL) OR
    (evento_id IS NULL AND iniciativa_id IS NOT NULL)
  )
);

-- Criar índices
CREATE INDEX idx_inscricoes_evento ON inscricoes(evento_id);
CREATE INDEX idx_inscricoes_iniciativa ON inscricoes(iniciativa_id);
CREATE INDEX idx_inscricoes_email ON inscricoes(email_colaborador);
CREATE INDEX idx_inscricoes_status ON inscricoes(status);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_inscricoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inscricoes_updated_at
BEFORE UPDATE ON inscricoes
FOR EACH ROW
EXECUTE FUNCTION update_inscricoes_updated_at();
```

### 2. Gerar Prisma Client

```bash
npx prisma generate
```

### 3. Testar Localmente

```bash
npm run dev
```

Aceda a:
- http://localhost:3000/colaborador/login - Login de voluntário
- http://localhost:3000/voluntariado - Dashboard (requer login)

## 📍 Rotas Criadas

| Rota | Descrição | Auth Necessária |
|------|-----------|-----------------|
| `/colaborador/login` | Página de login do voluntário | Não |
| `/voluntariado` | Dashboard do voluntário | Sim |
| `/api/inscricoes` [GET] | Listar inscrições (com filtros) | Não |
| `/api/inscricoes` [POST] | Criar nova inscrição | Não |

## 🔧 Componentes Criados

### 1. `ColaboradorContext` (`lib/context/ColaboradorContext.js`)
Context React para gestão de autenticação:
```javascript
const { colaborador, isAuthenticated, login, logout } = useColaborador();
```

### 2. `InscricaoModal` (`components/InscricaoModal.js`)
Modal reutilizável para inscrições:
```jsx
<InscricaoModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  eventoId={event.id}
  tipo="evento"
/>
```

### 3. Páginas
- `app/colaborador/login/page.js` - Página de login
- `app/voluntariado/page.js` - Dashboard do voluntário

### 4. Repositórios
- `lib/repositories/inscricoes.js` - CRUD de inscrições

## 🎨 Como Usar nos Componentes

### Mostrar botão de inscrição em EventCard

```jsx
import EventCard from '@/components/EventCard';

<EventCard 
  event={evento} 
  showInscricao={true} 
/>
```

### Mostrar botão de inscrição em IniciativaCard

```jsx
import IniciativaCard from '@/components/IniciativaCard';

<IniciativaCard 
  iniciativa={iniciativa} 
  showInscricao={true} 
/>
```

## 📊 API de Inscrições

### GET `/api/inscricoes`

Listar inscrições com filtros opcionais:

```javascript
// Todas as inscrições
fetch('/api/inscricoes')

// Inscrições de um evento específico
fetch('/api/inscricoes?eventoId=cuid123')

// Inscrições de uma iniciativa
fetch('/api/inscricoes?iniciativaId=cuid456')

// Inscrições de um voluntário
fetch('/api/inscricoes?emailColaborador=joao@exemplo.com')

// Por status
fetch('/api/inscricoes?status=APROVADA')
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid123",
      "eventoId": "evt123",
      "iniciativaId": null,
      "nomeColaborador": "João Silva",
      "emailColaborador": "joao@exemplo.com",
      "telefone": "+351 912 345 678",
      "mensagem": "Gostaria de participar...",
      "status": "PENDENTE",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "evento": {
        "id": "evt123",
        "nome": "Plantação de Árvores",
        "ngo": { "nome": "Verde Vivo" }
      }
    }
  ],
  "total": 1
}
```

### POST `/api/inscricoes`

Criar nova inscrição:

```javascript
const response = await fetch('/api/inscricoes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventoId: 'evt123',        // OU iniciativaId
    nomeColaborador: 'João Silva',
    emailColaborador: 'joao@exemplo.com',
    telefone: '+351 912 345 678',
    mensagem: 'Gostaria de saber mais...'
  })
});
```

**Resposta (sucesso):**
```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "status": "PENDENTE",
    ...
  }
}
```

**Erros possíveis:**
- `400` - Campos obrigatórios em falta
- `409` - Já existe inscrição para este evento/iniciativa
- `500` - Erro interno do servidor

## 🔐 Autenticação de Voluntário

### Como funciona

1. **Login:**
   - Voluntário entra nome e email
   - Dados salvos em `localStorage`
   - Redirecionado para `/voluntariado`

2. **Verificação:**
   - Header verifica `localStorage` em cada render
   - Mostra botão "Voluntário" ou nome do voluntário
   - Páginas protegidas redirecionam se não autenticado

3. **Logout:**
   - Remove dados do `localStorage`
   - Redireciona para homepage

### Exemplo de verificação manual

```javascript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();
  const [colaborador, setColaborador] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('colaborador');
    if (!saved) {
      router.push('/colaborador/login');
      return;
    }
    setColaborador(JSON.parse(saved));
  }, [router]);

  if (!colaborador) return <div>A carregar...</div>;

  return <div>Olá, {colaborador.nome}!</div>;
}
```

## 🎯 Próximos Passos Sugeridos

### Funcionalidades Futuras
- [ ] Página "Minhas Inscrições" no dashboard do voluntário
- [ ] Notificações por email quando inscrição é aprovada
- [ ] Histórico de participações
- [ ] Sistema de badges/conquistas
- [ ] Perfil público do voluntário
- [ ] Dashboard para ONGs gerirem inscrições
- [ ] Dashboard para Empresas gerirem inscrições em iniciativas
- [ ] Exportação de lista de participantes
- [ ] QR Code para check-in em eventos
- [ ] Certificados de participação

### Melhorias de UX
- [ ] Loading states mais elaborados
- [ ] Animações de transição
- [ ] Toast notifications
- [ ] Validação de email em tempo real
- [ ] Upload de foto de perfil
- [ ] Dark mode

## 🐛 Resolução de Problemas

### Problema: "Cannot find module 'InscricaoModal'"
**Solução:** Certifique-se de que o ficheiro `components/InscricaoModal.js` existe.

### Problema: Inscrição não é criada
**Solução:** 
1. Verifique se a tabela `inscricoes` foi criada no Supabase
2. Execute `npx prisma generate` novamente
3. Verifique logs do servidor (`npm run dev`)

### Problema: "Já está inscrito nesta oportunidade"
**Solução:** Esta é uma validação intencional. Cada voluntário só pode inscrever-se uma vez por evento/iniciativa.

### Problema: Voluntário não fica autenticado
**Solução:** 
1. Verifique se localStorage está habilitado no browser
2. Tente modo anónimo para testar sem extensões
3. Limpe o localStorage: `localStorage.clear()`

## 📞 Suporte

Para questões ou bugs, contacte o administrador do sistema.

---

**Data da última atualização:** Janeiro 2025  
**Versão do sistema:** 2.0

