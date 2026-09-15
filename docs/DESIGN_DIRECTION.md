# Direção de design — premium, humana e sem aparência de IA

## Objetivo

Elevar o site da Vanessa Braz Beleza e Autoestima para uma experiência premium, editorial, acolhedora e comercialmente clara, mantendo personalidade própria e forte uso de mídia real.

## Linguagem visual

Basear a identidade na marca real e em seus materiais. Como direção inicial, trabalhar com preto profundo, rosé/pink sofisticado, dourado quente e neutros claros apenas quando sustentados pela identidade existente. Antes de fixar tokens finais, amostrar as cores da logo oficial e validar contraste.

## O que evitar

Evitar explicitamente:

- gradientes genéricos ocupando grandes áreas sem função;
- brilho neon/glow em quase todos os elementos;
- glassmorphism como padrão de toda a página;
- fileiras de 3 ou 4 cards iguais para qualquer conteúdo;
- excesso de cantos muito arredondados;
- ícones genéricos em cada parágrafo;
- badges, estrelas e métricas inventadas;
- textos como “experiência transformadora” ou “resultado incomparável” sem evidência;
- imagens stock quando existe conteúdo real;
- hero com estética de landing page SaaS;
- movimentos contínuos ou efeitos que competem com as fotos.

## O que priorizar

- Fotografia real em escala generosa.
- Layout editorial com alternância entre texto e imagem.
- Algumas seções full-bleed e outras com respiro amplo.
- Tipografia de display elegante para títulos e fonte altamente legível para conteúdo.
- Hierarquia forte: uma mensagem principal por seção.
- Assimetrias sutis, sobreposições pontuais e recortes fotográficos intencionais.
- Bordas e divisores finos inspirados em material editorial/beauty premium.
- Microinterações curtas em hover/focus e entradas discretas apenas quando agregarem contexto.
- Botões de ação claros e poucos: agendar, WhatsApp, localização/contato quando os dados reais estiverem disponíveis.

## Estrutura recomendada

A implementação deve adaptar-se ao conteúdo real já existente no projeto, mas uma boa narrativa pode seguir:

1. Hero de identidade e ação principal.
2. Serviços principais sustentados por fotografias reais.
3. Manifesto curto sobre beleza e autoestima.
4. Destaque editorial de trabalho real/bastidores.
5. Galeria dinâmica com proporções variadas.
6. Bloco de confiança com informações comprovadas.
7. Agendamento/contato.
8. Localização e informações úteis.
9. Rodapé simples, sem excesso de navegação duplicada.

Não criar seções apenas para preencher espaço.

## Imagens

- Priorizar `object-fit: cover` com ponto focal consciente.
- Evitar aplicar filtros pesados que mudem cabelo, pele, esmalte ou resultado do serviço.
- Preservar tons de pele e cores reais.
- Para galeria, combinar retratos, detalhes e imagens ambientais em proporções diferentes.
- Em mobile, não usar a mesma cropagem do desktop sem verificar rostos e detalhes importantes.

## Movimento

- Duração curta e easing natural.
- Respeitar `prefers-reduced-motion`.
- Parallax, se usado, deve ser leve e nunca prejudicar leitura/performance.
- Não usar cursor customizado, partículas decorativas ou animações infinitas sem justificativa de marca.

## UX e conversão

A estética não deve esconder o próximo passo. O usuário precisa entender rapidamente o que é o espaço, quais serviços são oferecidos, como entrar em contato, onde fica e como agendar — usando somente dados confirmados.

## Checklist antes de concluir

- A primeira dobra parece uma marca de beleza real, não um template genérico?
- As fotos reais são protagonistas?
- Há variedade de ritmo entre as seções?
- A página funciona bem em 360 px de largura?
- Textos e botões têm contraste suficiente?
- O foco por teclado é visível?
- As animações continuam boas com reduced motion?
- Nenhum dado comercial foi inventado?
- Imagens originais permanecem intactas em `media/source`?
