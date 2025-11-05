# DEPRECATED: Página ONG22

Esta pasta contém a versão estática antiga da página da Associação CAIS.

## ⚠️ Esta página foi descontinuada

A página foi substituída pela **rota dinâmica**: `app/ongs/[id]/page.js`

## 🔄 Como Usar a Nova Rota

Para acessar uma ONG específica, use a URL:
```
/ongs/{id-da-ong}
```

### Exemplo:
Se a CAIS tem o ID `cais-123` na base de dados, acesse:
```
http://localhost:3000/ongs/cais-123
```

## 📦 Dados Necessários

Certifique-se de que a ONG está cadastrada na base de dados com:
- ✅ Nome, descrição, missão
- ✅ Email, telefone, localização
- ✅ Logo e imagem de capa
- ✅ Áreas de atuação
- ✅ Tipos de colaboração
- ✅ ODS relacionados
- ✅ Métricas de impacto (JSON array)
- ⚠️ Eventos (criados separadamente)
- ⚠️ URL de vídeo (opcional)

## 🚀 Vantagens da Nova Rota

1. **Dinâmica**: Busca dados da base de dados em tempo real
2. **SEO**: Metadata gerado automaticamente
3. **Eventos**: Integração automática com sistema de eventos
4. **Manutenível**: Um template para todas as ONGs
5. **Escalável**: Adiciona novas ONGs sem código

## 📝 Arquivos de Backup

Os arquivos antigos estão preservados como:
- `page.backup.js` (nesta pasta)
- `app/ongs/[id]/page.backup.js`

