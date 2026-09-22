# DEPLOYMENT HARDENING — Vanessa Braz

## Objetivo

Fechar os controles de segurança e operação que podem ser concluídos no repositório antes de qualquer publicação em produção.

## Implementado nesta branch

- CSP e cabeçalhos de segurança para Vercel (`vercel.json`).
- `script-src 'self'`, bloqueio de framing, `nosniff`, Referrer-Policy, Permissions-Policy e HSTS.
- Bootstrap inline removido do `index.html`; estilos-base permanecem no CSS versionado.
- Webhook de pagamentos com limite de payload (256 KiB).
- Validação de `Content-Type: application/json`.
- Timeout de 10 s para lookup autoritativo no Mercado Pago.
- Respostas de erro não expõem detalhes internos do PostgreSQL/Supabase.
- Logs estruturados com `requestId`, sem registrar secrets nem payload completo.
- Respostas do webhook usam `Cache-Control: no-store` e `X-Content-Type-Options: nosniff`.
- Teste de regressão para os controles acima.

## Controles que permanecem externos ao repositório

### Supabase hospedado

Ainda é necessário selecionar/criar o projeto Supabase dedicado a Vanessa Braz, aplicar as migrations, revisar Security/Performance Advisors, configurar Auth e fazer bootstrap controlado do primeiro admin.

Não reutilizar outro projeto Supabase sem decisão explícita de arquitetura/isolamento.

### Rate limiting

O frontend é estático e o Auth é fornecido pelo Supabase. Rate limits de Auth devem ser configurados no projeto hospedado. O webhook possui assinatura HMAC, idempotência, limite de corpo e timeout; limitação distribuída adicional deve ser configurada na camada de edge/plataforma após existir o projeto hospedado, sem depender de memória local do processo.

### Mercado Pago

Faltam secrets sandbox/produção no ambiente server-side, URL pública do webhook e teste ponta a ponta com evento real assinado. Nunca colocar access token ou webhook secret em variáveis `VITE_*`.

### GitHub

A branch `main` ainda precisa de proteção/ruleset com PR obrigatório e checks CI/CodeQL exigidos. Isso é uma configuração administrativa do repositório e não é substituído por arquivos versionados.

### Publicação/LGPD

Mídias e conteúdo comercial permanecem bloqueados para publicação enquanto autorização, catálogo, preços, contato, localização, regras comerciais e textos jurídicos não forem confirmados.

## Gate de produção

Produção permanece **BLOCKED** até os itens externos acima serem concluídos e os PRs empilhados serem revalidados contra `main`.
