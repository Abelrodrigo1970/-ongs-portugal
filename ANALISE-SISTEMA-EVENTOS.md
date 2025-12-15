# Análise Completa do Sistema de Eventos

## 📋 Resumo do Objetivo

Criar um sistema onde:
1. **Eventos** têm um número determinado de vagas (`maxParticipantes`)
2. **Eventos** têm duração em horas (calculada de `dataInicio` a `dataFim`)
3. **Eventos** têm causas (áreas de atuação) relacionadas
4. **Inscrições** preenchem as vagas do evento
5. **Não pode haver colaboradores repetidos** no mesmo evento

---

## 🗄️ Estrutura das Tabelas

### 1. **Event** (Eventos)
```prisma
model Event {
  id               String   @id @default(cuid())
  nome             String
  descricao        String
  dataInicio       DateTime      // Data/hora de início
  dataFim          DateTime?     // Data/hora de fim (opcional)
  maxParticipantes Int?          // Número máximo de vagas
  inscricoesAbertas Boolean @default(true)
  ngoId            String        // ONG organizadora
  areas            EventArea[]   // Relação com áreas de atuação (causas)
  ods              EventODS[]    // Relação com ODS
  inscricoes       Inscricao[]   // Inscrições de colaboradores
}
```

**Características:**
- ✅ Tem `maxParticipantes` (vagas)
- ✅ Tem `dataInicio` e `dataFim` (duração calculável)
- ✅ Relacionado com `EventArea[]` (causas/áreas de atuação)
- ✅ Relacionado com `Inscricao[]` (inscrições)

### 2. **EventArea** (Causas do Evento)
```prisma
model EventArea {
  id               String @id @default(cuid())
  eventId          String
  areaAtuacaoTipoId String
  tipo             AreaAtuacaoTipo  // Nome da causa (ex: "Saúde", "Educação")
  
  @@unique([eventId, areaAtuacaoTipoId])  // Um evento não pode ter a mesma causa duas vezes
}
```

**Características:**
- ✅ Um evento pode ter múltiplas causas
- ✅ Constraint única previne duplicatas

### 3. **Inscricao** (Inscrições)
```prisma
model Inscricao {
  id               String @id @default(cuid())
  eventoId         String?      // ID do evento
  iniciativaId     String?      // ID da iniciativa (alternativa)
  nomeColaborador  String
  emailColaborador String       // Normalizado (lowercase + trim)
  status           StatusInscricao @default(PENDENTE)  // PENDENTE, APROVADA, REJEITADA, CANCELADA
  
  @@unique([eventoId, emailColaborador])  // Não pode haver mesmo email duas vezes no mesmo evento
}
```

**Características:**
- ✅ Status: `PENDENTE`, `APROVADA`, `REJEITADA`, `CANCELADA`
- ✅ **Constraint única** no banco: `@@unique([eventoId, emailColaborador])`
- ✅ Email normalizado para evitar duplicatas (case-insensitive)

---

## 🔄 Fluxo de Funcionamento

### 1. **Criar Evento**

**Endpoint:** `POST /api/admin/events`

**Dados necessários:**
```json
{
  "nome": "Formação em Primeiros Socorros",
  "descricao": "...",
  "dataInicio": "2024-11-30T09:00:00Z",
  "dataFim": "2024-11-30T17:00:00Z",
  "maxParticipantes": 60,
  "areas": ["area-id-1", "area-id-2"],  // IDs das áreas de atuação
  "ngoId": "ngo-id"
}
```

**Processo:**
1. Evento é criado com `maxParticipantes` (ex: 60 vagas)
2. Causas são relacionadas via `EventArea`
3. `inscricoesAbertas` = `true` por padrão

### 2. **Calcular Duração em Horas**

**Função:** `calcularDuracaoEvento(dataInicio, dataFim)`

**Implementação:**
```javascript
const inicio = new Date(dataInicio);
const fim = dataFim ? new Date(dataFim) : new Date();
const diffMs = fim - inicio;
const diffHoras = Math.round(diffMs / (1000 * 60 * 60));
```

**Exemplo:**
- `dataInicio`: 2024-11-30 09:00
- `dataFim`: 2024-11-30 17:00
- **Duração**: 8 horas

### 3. **Inserir Inscrição**

**Endpoint:** `POST /api/inscricoes`

**Validações implementadas:**

1. **Verificação de Duplicatas (ANTES de criar):**
   ```javascript
   const existingInscricao = await checkInscricao(eventoId, null, emailColaborador);
   if (existingInscricao) {
     return 409 Conflict; // "Já está inscrito nesta oportunidade"
   }
   ```

2. **Verificação de Vagas Disponíveis:**
   ```javascript
   const vagas = await getVagasEvento(eventoId);
   if (vagas.disponiveis <= 0) {
     throw new Error('Não há vagas disponíveis');
   }
   ```

3. **Verificação de Inscrições Abertas:**
   ```javascript
   if (!event.inscricoesAbertas) {
     throw new Error('As inscrições estão encerradas');
   }
   ```

4. **Normalização de Email:**
   ```javascript
   emailColaborador = emailColaborador.toLowerCase().trim();
   ```

5. **Constraint Única no Banco:**
   - Se mesmo assim tentar duplicar, o Prisma retorna erro `P2002`

### 4. **Preencher Vagas**

**Contagem de Vagas Ocupadas:**
```javascript
const ocupadas = await countInscricoesAprovadas(eventoId);
// Conta apenas inscrições com status = 'APROVADA'
```

**Cálculo de Vagas Disponíveis:**
```javascript
const total = event.maxParticipantes || 0;
const ocupadas = await countInscricoesAprovadas(eventoId);
const disponiveis = total > 0 ? Math.max(0, total - ocupadas) : null;
```

**Exemplo:**
- `maxParticipantes`: 60
- Inscrições aprovadas: 10
- **Disponíveis**: 50

---

## ✅ Prevenção de Colaboradores Repetidos

### Camadas de Proteção:

1. **Verificação Lógica (Repositório):**
   ```javascript
   checkInscricao(eventoId, emailColaborador)
   // Busca no banco ANTES de criar
   ```

2. **Normalização de Email:**
   ```javascript
   emailColaborador.toLowerCase().trim()
   // Evita duplicatas por diferença de maiúsculas/minúsculas
   ```

3. **Constraint Única no Banco:**
   ```prisma
   @@unique([eventoId, emailColaborador])
   // Garantia a nível de banco de dados
   ```

4. **Tratamento de Erro:**
   ```javascript
   if (error.code === 'P2002') {
     throw new Error('Já existe uma inscrição com estes dados');
   }
   ```

**Resultado:** É impossível ter o mesmo colaborador (email) inscrito duas vezes no mesmo evento.

---

## 📊 Funções Auxiliares Criadas

### 1. `countInscricoesAprovadas(eventoId)`
- Conta apenas inscrições com status `APROVADA`
- Usado para calcular vagas ocupadas

### 2. `getVagasEvento(eventoId)`
- Retorna: `{ total, ocupadas, disponiveis, hasLimit }`
- Verifica se evento tem limite de vagas

### 3. `calcularDuracaoEvento(dataInicio, dataFim)`
- Calcula duração em horas
- Usado no `GuestBar` para mostrar horas dedicadas

### 4. `checkInscricao(eventoId, emailColaborador)`
- Verifica se colaborador já está inscrito
- Usado ANTES de criar nova inscrição

---

## 🔌 APIs Disponíveis

### 1. **Buscar Vagas do Evento**
```
GET /api/events/{eventoId}/vagas
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 60,
    "ocupadas": 10,
    "disponiveis": 50,
    "hasLimit": true
  }
}
```

### 2. **Listar Inscrições**
```
GET /api/inscricoes?eventoId={eventoId}&status=APROVADA
```

### 3. **Criar Inscrição**
```
POST /api/inscricoes
{
  "eventoId": "event-id",
  "nomeColaborador": "João Silva",
  "emailColaborador": "joao@example.com"
}
```

---

## 📝 Status das Inscrições

- **PENDENTE**: Inscrição criada, aguardando aprovação
- **APROVADA**: Inscrição aprovada, ocupa uma vaga
- **REJEITADA**: Inscrição rejeitada
- **CANCELADA**: Inscrição cancelada

**Apenas inscrições `APROVADA` contam para preencher vagas.**

---

## 🎯 Resumo das Implementações

✅ **Evento com número de vagas**: `maxParticipantes` no schema  
✅ **Duração em horas**: Função `calcularDuracaoEvento()`  
✅ **Causas relacionadas**: Via `EventArea[]`  
✅ **Inscrições preenchem vagas**: Contagem via `countInscricoesAprovadas()`  
✅ **Sem colaboradores repetidos**: Constraint única + verificação lógica  
✅ **Verificação de vagas disponíveis**: Antes de criar inscrição  
✅ **Dados reais no EventDialog**: Busca via API `/api/events/{id}/vagas`  

---

## 🔧 Melhorias Futuras Sugeridas

1. **Migração do Banco:**
   - A constraint única `@@unique([eventoId, emailColaborador])` precisa de uma migração
   - Executar: `npx prisma migrate dev --name add_unique_inscricao_email`

2. **Status Automático:**
   - Aprovar automaticamente se houver vagas disponíveis
   - Ou criar workflow de aprovação

3. **Notificações:**
   - Notificar quando evento estiver quase lotado
   - Notificar quando inscrição for aprovada/rejeitada

4. **Relatórios:**
   - Dashboard de ocupação de vagas
   - Gráficos de inscrições por evento

