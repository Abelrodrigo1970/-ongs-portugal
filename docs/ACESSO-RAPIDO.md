# 🚀 Guia de Acesso Rápido - ONGs Portugal

## 📍 URLs Principais

### Páginas Públicas
| URL | Descrição |
|-----|-----------|
| `/` | Homepage com busca e destaques |
| `/ongs` | Lista de todas as ONGs |
| `/ongs/[id]` | Perfil detalhado de uma ONG |
| `/eventos` | Lista de todos os eventos |
| `/eventos/[id]` | Detalhes de um evento |
| `/empresas` | Lista de empresas parceiras |
| `/empresas/[id]` | Perfil da empresa |
| `/ods` | Objetivos de Desenvolvimento Sustentável |

### Área de Voluntário 🤝
| URL | Descrição | Autenticação |
|-----|-----------|--------------|
| `/colaborador/login` | Login de voluntário | ❌ Não |
| `/voluntariado` | Dashboard do voluntário | ✅ Sim |

### Área de Empresa 🏢
| URL | Descrição |
|-----|-----------|
| `/empresas/dashboard/[id]` | Dashboard da empresa |

### Administração 🔧
| URL | Descrição | Ambiente |
|-----|-----------|----------|
| `/admin` | Painel administrativo | Dev apenas |

## 🎯 Como Aceder

### Como Voluntário

1. **Fazer Login:**
   ```
   Aceda a: /colaborador/login
   Preencha: Nome e Email
   Clique: "Entrar como Voluntário"
   ```

2. **Explorar Oportunidades:**
   ```
   Após login → Redireciona para /voluntariado
   - Ver eventos disponíveis
   - Ver iniciativas empresariais
   - Clicar "Inscrever-me" nos cards
   ```

3. **Inscrever-se:**
   ```
   Clicar no botão "Inscrever-me" →
   Preencher formulário →
   Aguardar aprovação
   ```

### Como Empresa

1. **Ver Perfil:**
   ```
   Aceda a: /empresas/[id]
   Exemplo: /empresas/clxxx123
   ```

2. **Ver Dashboard:**
   ```
   Aceda a: /empresas/dashboard/[id]
   Exemplo: /empresas/dashboard/clxxx123
   
   Dashboard mostra:
   - KPIs (horas, projetos, voluntários)
   - Gráficos de impacto
   - Iniciativas ativas
   - Propostas pendentes
   ```

### Como Administrador (Dev)

1. **Painel Admin:**
   ```
   Aceda a: /admin
   (Apenas disponível em desenvolvimento)
   
   Gerir:
   - ONGs
   - Eventos
   - Áreas de Atuação
   - ODS
   - Tipos de Colaboração
   ```

## 🔑 Sistema de Autenticação

### Voluntário (Simples)
- **Método:** localStorage
- **Dados:** Nome + Email
- **Persistência:** Sessão do browser
- **Logout:** Botão no dashboard

### Empresa (Futuro)
- **Status:** A implementar
- **Método sugerido:** NextAuth.js ou Supabase Auth

### Admin (Futuro)
- **Status:** A implementar
- **Recomendação:** Supabase Row Level Security

## 📱 Navegação Rápida

### Header (Sempre Visível)
```
[Logo] ONGs Portugal

Links:
- Início → /
- ONGs → /ongs
- Eventos → /eventos
- Empresas → /empresas
- ODS → /ods
- [Botão Voluntário] → /colaborador/login ou /voluntariado
```

### Footer
```
- Links rápidos
- Redes sociais
- Copyright
```

## 🎨 Cards com Inscrição

### EventCard
```jsx
// Sem botão de inscrição
<EventCard event={evento} />

// Com botão de inscrição
<EventCard event={evento} showInscricao={true} />
```

### IniciativaCard
```jsx
// Sem botão de inscrição
<IniciativaCard iniciativa={iniciativa} />

// Com botão de inscrição (apenas se ATIVA)
<IniciativaCard iniciativa={iniciativa} showInscricao={true} />
```

## 🔍 Sistema de Busca

### Homepage
```
Barra de busca principal:
- Busca em ONGs e Eventos simultaneamente
- Filtros: Áreas, ODS, Localização, Tipo
- Resultados em tempo real (300ms debounce)
```

### Páginas Dedicadas
```
/ongs → FilterBar para ONGs
/eventos → FilterBar para Eventos
```

## 📊 APIs Disponíveis

### Busca
```
GET /api/search/ngos?query=...&area=...&ods=...
GET /api/search/events?query=...&area=...&localizacao=...
```

### Empresas
```
GET /api/empresas?featured=true
```

### Iniciativas
```
GET /api/iniciativas?status=ATIVA
```

### Inscrições
```
GET /api/inscricoes?eventoId=...
POST /api/inscricoes
```

## 🎯 Fluxos de Utilizador

### Fluxo 1: Visitante → Voluntário
```
1. Homepage → Ver eventos interessantes
2. Clicar "Voluntário" no header
3. Fazer login (nome + email)
4. Dashboard do voluntário
5. Explorar eventos e iniciativas
6. Clicar "Inscrever-me"
7. Preencher formulário
8. Aguardar confirmação
```

### Fluxo 2: Visitante → Explorar ONGs
```
1. Homepage → Clicar "Ver Todas as ONGs"
2. Página /ongs → Usar filtros
3. Clicar numa ONG
4. Ver perfil completo (/ongs/[id])
5. Ver eventos da ONG
6. Visitar website/redes sociais
```

### Fluxo 3: Empresa → Ver Dashboard
```
1. Aceder /empresas
2. Clicar na empresa
3. Ver perfil (/empresas/[id])
4. Clicar "Ver Dashboard"
5. Ver KPIs e métricas
6. Ver iniciativas ativas
7. Ver propostas pendentes
```

## 🛠️ Debugging

### Ver dados do voluntário logado
```javascript
// No console do browser
localStorage.getItem('colaborador')
```

### Limpar sessão
```javascript
localStorage.clear()
```

### Ver todas as inscrições (API)
```bash
curl http://localhost:3000/api/inscricoes
```

## 📞 Links Úteis

- **Repositório:** https://github.com/Abelrodrigo1970/-ongs-portugal
- **Vercel:** (URL do deploy)
- **Supabase:** (URL do projeto)

---

**Última atualização:** Janeiro 2025

