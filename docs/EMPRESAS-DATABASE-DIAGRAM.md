# 🗄️ Diagrama da Base de Dados - Empresas

## 📐 Diagrama Entidade-Relacionamento (ER)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CORE: EMPRESAS                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   EMPRESA    │
                              ├──────────────┤
                              │ id (PK)      │
                              │ nome         │
                              │ missao       │
                              │ email        │
                              │ telefone     │
                              │ localizacao  │
                              │ logo         │
                              │ website      │
                              │ visivel      │
                              └──────┬───────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐           ┌────────────────┐          ┌──────────────────┐
│ COLABORADOR   │           │  INICIATIVA    │          │  ESTATISTICAS    │
├───────────────┤           ├────────────────┤          │    IMPACTO       │
│ id (PK)       │           │ id (PK)        │          ├──────────────────┤
│ empresa_id FK │           │ empresa_id FK  │          │ id (PK)          │
│ nome          │           │ causa_id FK    │          │ empresa_id FK    │
│ email         │           │ titulo         │          │ periodo_ano      │
│ departamento  │           │ descricao      │          │ periodo_mes      │
│ cargo         │           │ data_inicio    │          │ horas_vol        │
│ ativo         │           │ data_fim       │          │ num_projetos     │
└───────┬───────┘           │ tipo_apoio     │          │ num_voluntarios  │
        │                   │ vagas          │          │ valor_doacoes    │
        │                   │ status         │          └──────────────────┘
        │                   └────────┬───────┘
        │                            │
        └────────────┐               │
                     ▼               ▼
              ┌─────────────────────────┐
              │ INSCRICAO_INICIATIVA    │
              ├─────────────────────────┤
              │ id (PK)                 │
              │ iniciativa_id FK        │
              │ colaborador_id FK       │
              │ status                  │
              │ horas_contribuidas      │
              └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      RELAÇÕES MANY-TO-MANY                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌─────────────────────┐         ┌──────────────────┐
│   EMPRESA    │ ──N:M── │ EMPRESA_TIPOS_APOIO │ ──N:M── │ TIPO_APOIO       │
└──────────────┘         └─────────────────────┘         │ EMPRESA          │
                                                          ├──────────────────┤
                                                          │ id (PK)          │
                                                          │ nome             │
                                                          │ tipo (ENUM)      │
                                                          └──────────────────┘

┌──────────────┐         ┌─────────────────┐         ┌──────────────────────┐
│   EMPRESA    │ ──N:M── │  EMPRESA_ODS    │ ──N:M── │  ODS (EXISTENTE)     │
└──────────────┘         └─────────────────┘         └──────────────────────┘

┌──────────────┐         ┌─────────────────┐         ┌──────────────────────┐
│   EMPRESA    │ ──N:M── │ EMPRESA_CAUSAS  │ ──N:M── │      CAUSAS          │
└──────────────┘         └─────────────────┘         ├──────────────────────┤
                                                      │ id (PK)              │
                                                      │ nome                 │
                                                      │ descricao            │
                                                      └──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLABORAÇÃO: ONGs ↔ Empresas                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐                                        ┌──────────────────┐
│   EMPRESA    │                                        │ NGO (EXISTENTE)  │
└──────┬───────┘                                        └────┬─────────────┘
       │                                                     │
       │    ┌──────────────┐                                │
       ├────│  FAVORITO    │────────────────────────────────┤
       │    ├──────────────┤                                │
       │    │ id (PK)      │                                │
       │    │ ong_id FK    │                                │
       │    │ empresa_id FK│                                │
       │    └──────────────┘                                │
       │                                                     │
       │    ┌──────────────┐                                │
       ├────│  PROPOSTA    │────────────────────────────────┤
       │    ├──────────────┤                                │
       │    │ id (PK)      │                                │
       │    │ ong_id FK    │                                │
       │    │ empresa_id FK│                                │
       │    │ status       │                                │
       │    │ titulo       │                                │
       │    │ descricao    │                                │
       │    └──────┬───────┘                                │
       │           │                                        │
       │    ┌──────┴───────┐                                │
       └────│   REUNIAO    │────────────────────────────────┘
            ├──────────────┤
            │ id (PK)      │
            │ empresa_id FK│
            │ ong_id FK    │
            │ proposta_id FK (opcional)
            │ start_at     │
            │ end_at       │
            │ status       │
            │ tipo_reuniao │
            └──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           RELATÓRIOS E AUDITORIA                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌─────────────────────────┐
│   EMPRESA    │ ──1:N── │ EXPORTACAO_RELATORIO    │
└──────────────┘         ├─────────────────────────┤
                         │ id (PK)                 │
                         │ empresa_id FK           │
                         │ colaborador_id FK       │
                         │ titulo                  │
                         │ filtros_json (JSONB)    │
                         │ formato (ENUM)          │
                         │ caminho_ficheiro        │
                         └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENUMS UTILIZADOS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

StatusIniciativa:      RASCUNHO | ATIVA | PAUSADA | CONCLUIDA | CANCELADA
StatusProposta:        PENDENTE | EM_ANALISE | APROVADA | REJEITADA | ARQUIVADA
StatusReuniao:         AGENDADA | CONFIRMADA | REALIZADA | CANCELADA | REMARCADA
StatusInscricao:       PENDENTE | CONFIRMADA | CANCELADA | CONCLUIDA
TipoApoio:             TEMPO_VOLUNTARIADO | CONHECIMENTO_CAPACITACAO | 
                       RECURSOS_SERVICOS | PRODUTOS_BENS
FormatoRelatorio:      PDF | EXCEL | CSV | JSON
TipoReuniao:           PRESENCIAL | ONLINE | HIBRIDA

┌─────────────────────────────────────────────────────────────────────────────┐
│                      CARDINALIDADES E CONSTRAINTS                           │
└─────────────────────────────────────────────────────────────────────────────┘

EMPRESA ──1:N── COLABORADOR
EMPRESA ──1:N── INICIATIVA
EMPRESA ──1:N── ESTATISTICA_IMPACTO
EMPRESA ──N:M── ODS (via empresa_ods)
EMPRESA ──N:M── CAUSAS (via empresa_causas)
EMPRESA ──N:M── TIPOS_APOIO (via empresa_tipos_apoio)
EMPRESA ──N:M── NGO (via favoritos)
EMPRESA ──1:N── PROPOSTA
EMPRESA ──1:N── REUNIAO

INICIATIVA ──1:N── INSCRICAO_INICIATIVA
COLABORADOR ──1:N── INSCRICAO_INICIATIVA
INICIATIVA ──1:N── PROPOSTA (opcional)

NGO ──1:N── PROPOSTA
NGO ──1:N── REUNIAO
NGO ──1:N── FAVORITO

PROPOSTA ──1:N── REUNIAO (opcional)

UNIQUE CONSTRAINTS:
- (empresa_id, email) em colaboradores
- (empresa_id, ods_id) em empresa_ods
- (empresa_id, causa_id) em empresa_causas
- (empresa_id, tipo_apoio_id) em empresa_tipos_apoio
- (empresa_id, periodo_ano, periodo_mes) em estatisticas_impacto_empresa
- (iniciativa_id, colaborador_id) em inscricoes_iniciativa
- (ong_id, empresa_id) em favoritos

┌─────────────────────────────────────────────────────────────────────────────┐
│                      PERFORMANCE E ESCALABILIDADE                           │
└─────────────────────────────────────────────────────────────────────────────┘

Views Materializadas:
✓ Pré-calculam agregações pesadas
✓ Refresh programado (cron ou trigger)
✓ Aceleram dashboard em 10-100x

Índices Compostos:
✓ (empresa_id, status, data) para listagens filtradas
✓ (periodo_ano, periodo_mes) para queries temporais
✓ Suportam ORDER BY e WHERE eficientes

Particionamento (Futuro):
✓ estatisticas_impacto_empresa por ano
✓ exportacoes_relatorios por mês
✓ Melhora performance com dados históricos grandes
