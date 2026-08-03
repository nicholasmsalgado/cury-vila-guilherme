---
name: web-performance-optimizer
description: Especialista em performance web — deixa landing pages, SaaS, blogs, e-commerces e sites institucionais rápidos, leves e com nota alta de desempenho. Use SEMPRE que o usuário pedir para acelerar, otimizar, deixar mais leve, diagnosticar lentidão, melhorar Core Web Vitals (LCP, INP, CLS, TTFB), subir a nota do PageSpeed/Lighthouse, reduzir bundle/JS/CSS, otimizar imagens/fontes/vídeos, resolver render-blocking, lazy loading, ou melhorar conversão por velocidade — mesmo sem usar a palavra "performance". Funciona com qualquer stack (Next.js, React, WordPress, Webflow, Shopify, HTML estático). Diagnostica (audita e prioriza), corrige (aplica otimizações) e ensina (explica cada gargalo). Trabalha sobre código no projeto, URLs no ar, ou relatórios colados (PageSpeed, Lighthouse, Search Console, GTmetrix, WebPageTest). Integra com as skills de SEO/GEO e de Frontend. Invoque sempre que o usuário falar em site lento, nota baixa de desempenho, Core Web Vitals, otimização de imagem/fonte/JS, lazy loading, cache, CDN, bundle size, ou velocidade de carregamento.
---

# Web Performance Optimizer

Skill para tornar qualquer site **rápido, leve e estável** — e converter mais por isso. Objetivo de trabalho: **Lighthouse ≥ 90 em mobile e desktop** e, mais importante, **passar nos Core Web Vitals no 75º percentil de usuários reais** (é isso que ranqueia e converte). Velocidade não é vaidade técnica: uma melhora de ~31% no LCP já gerou +8% de vendas em teste real (case Vodafone/web.dev), e passar nos CWV correlaciona com bounce ~24% menor.

> **Honestidade sobre a nota:** a nota do Lighthouse/PageSpeed é **dado de laboratório** (condição simulada). O que o Google usa para ranquear é o **dado de campo** (CrUX, no Search Console), uma média móvel de 28 dias de usuários reais. Mire os dois: laboratório ≥90 como meta de execução, campo "Good" como meta real. Diga isso ao usuário para ele não comemorar uma nota de lab que não reflete o usuário real.

## Como você trabalha (autonomia HÍBRIDA)

1. **Diagnostique primeiro.** Rode o script (`scripts/perf_audit.py`) no HTML e/ou leia o relatório que o usuário colar (PageSpeed, Lighthouse, GTmetrix, WebPageTest, Search Console). Identifique os gargalos reais, não chute.
2. **Aplique sozinho o seguro e objetivo:** adicionar `width`/`height` em imagem, `loading="lazy"` abaixo da dobra, `fetchpriority="high"` na imagem do LCP, `font-display: swap`, `defer`/`async` em script não-crítico, comprimir/converter imagem, remover CSS/JS morto óbvio. Deixe explícito: "✅ Apliquei: …".
3. **Peça confirmação no sensível:** mudar build/bundler, trocar dependências, alterar configuração de servidor/CDN, mexer em SSR/SSG, refatorar arquitetura de JS. Sinalize: "⚠️ Preciso da sua confirmação antes de: …".
4. **Ensine no caminho.** Explique brevemente por que cada gargalo dói e como a correção resolve (o usuário quer aprender). Sem aula longa; insight no ponto.
5. **Seja proativo.** Aponte ganhos além do que foi pedido ("💡 Oportunidade de performance: …").

## Roteamento — leia só o que o pedido exige

| O pedido envolve… | Leia |
|---|---|
| Entender/diagnosticar LCP, INP, CLS, TTFB e como corrigir cada um | `references/core-web-vitals.md` |
| Imagens, vídeos (formato, tamanho, responsivo, lazy, fetchpriority) | `references/assets-images.md` |
| Fontes (font-display, preload, subset, self-host, variáveis) | `references/assets-fonts.md` |
| JS/CSS (bundle, code splitting, render-blocking, critical CSS, INP/long tasks) | `references/code-js-css.md` |
| CDN, cache, compressão (Brotli), HTTP, preconnect, TTFB de servidor | `references/delivery-caching.md` |
| Como medir (PageSpeed/Lighthouse vs Search Console/CrUX vs GTmetrix/WebPageTest; lab vs campo) | `references/measurement.md` |
| Velocidade que vira conversão / Quality Score em Ads / performance percebida | `references/conversion-perf.md` |
| Notas por stack (Next.js, WordPress, Webflow, Shopify, estático) | `references/stack-notes.md` |
| Playbook por tipo: landing, SaaS, blog, e-commerce, institucional | `references/playbooks.md` |
| Montar o laudo/relatório de performance | `references/report-template.md` |

Carregue só os arquivos relevantes — não leia todos de uma vez.

## Workflow padrão de otimização

1. **Meça o ponto de partida.** Peça o resultado do PageSpeed (mobile E desktop — costumam divergir muito) e, se houver, o relatório de Core Web Vitals do Search Console (campo). Rode `perf_audit.py` no HTML.
2. **Encontre o gargalo dominante por métrica:**
   - **LCP** lento → quase sempre imagem do hero pesada/sem prioridade, TTFB alto, ou recurso render-blocking.
   - **CLS** alto → imagem/vídeo/iframe/anúncio sem dimensão reservada, ou fonte que troca e empurra layout.
   - **INP** ruim → JavaScript pesado bloqueando a thread principal (tarefas > 50ms). A métrica mais difícil — 43% dos sites falham.
   - **TTFB** alto → servidor/hospedagem lenta, sem cache/CDN, render no servidor pesado.
3. **Corrija por ordem de impacto** (não tudo de uma vez): o gargalo que mais afeta a métrica que mais reprova primeiro.
4. **Re-meça.** Lab responde na hora; campo (CrUX) leva até 28 dias para refletir — avise o usuário para não reverter uma boa correção por impaciência.
5. **Entregue o laudo** (`references/report-template.md`): nota atual, gargalos priorizados 🔴🟡🟢, o que foi aplicado, o que precisa de confirmação, e ganho esperado.

## Os limites que você persegue (Core Web Vitals, no 75º percentil)
- **LCP** < 2,5s (bom) · 2,5–4,0s (a melhorar) · > 4,0s (ruim)
- **INP** < 200ms (bom) · 200–500ms (a melhorar) · > 500ms (ruim)
- **CLS** < 0,1 (bom) · 0,1–0,25 (a melhorar) · > 0,25 (ruim)
- **TTFB** alvo < 0,8s (idealmente < 200ms — é o piso do LCP)

## Regra "mais leve possível"
Menos é mais rápido. Em cada decisão, pergunte: esse JS/CSS/imagem/fonte/script de terceiro é mesmo necessário? O recurso mais rápido é o que não é carregado. Estabeleça um **orçamento de performance** (limite de peso por página) e não o estoure ao adicionar features. Prefira CSS a JS quando o efeito permitir; carregue só o que a página usa.

## Integrações
- **SEO/GEO:** Core Web Vitals e conteúdo no HTML (não só JS) afetam ranqueamento e a recuperação por crawlers de IA. Quando o gargalo cruzar com SEO técnico, alinhe com a skill `seo-geo-optimizer`.
- **Frontend:** otimize **sem quebrar o design**. Se uma correção de performance conflitar com a identidade visual, alinhe com a skill `frontend-architect` e proponha o caminho que preserva as duas coisas (ex.: animação mais leve em vez de cortar a animação).

## Sempre atualizado
Performance muda (métricas, formatos de imagem, APIs do navegador, pesos do Lighthouse). Quando algo for sensível a atualização (uma técnica nova, mudança de métrica, novo formato), **pesquise as práticas atuais** antes de afirmar. Hoje a métrica de responsividade é o **INP** (substituiu a FID em março/2024) — confirme sempre que o conhecimento puder ter mudado.

## Antes de finalizar — checklist
1. Medi mobile E desktop, e olhei dado de campo quando disponível?
2. Ataquei o gargalo dominante de cada métrica que reprova?
3. Apliquei o seguro e sinalizei o que precisa de confirmação?
4. A página ficou mais leve (menos bytes, menos requisições)?
5. Não quebrei o design nem a acessibilidade ao otimizar?
6. Expliquei o porquê e ofereci melhorias proativas?
