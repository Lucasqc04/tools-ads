# Simulador de Post do Instagram: referência de medidas

Documento interno. Registra os valores usados pela prévia e o nível de confiança de cada um.
Nada aqui é medida oficial da Meta, e a ferramenta não é afiliada ao Instagram.

## Status de verificação

- **Confirmado (fonte de terceiros, consistente entre fontes):** valor citado em mais de uma fonte, sem confirmação oficial.
- **Estimativa:** não encontrado em fonte confiável. Deve ser medido em aparelho real antes de ser tratado como medida.
- **Referência do projeto:** valor herdado de `lib/instagram-image-optimizer.ts` (cita a central de ajuda do Instagram) ou do briefing.

## Aparelho

| Item | Valor usado | Status | Fontes |
|---|---|---|---|
| iPhone 17 Pro, área lógica | 402 × 874 pt | Confirmado (terceiros). Mesma grade de 6,3" em 3× (1206 × 2622 px). | [picturesizes.com](https://picturesizes-com.pages.dev/specs/devices/iphone-17), [engineered.at](https://engineered.at/articles/iphone-17-screen-sizes) |
| iPhone 17 Pro Max, área lógica | 440 × 956 pt | Confirmado (terceiros) | [shopsavvy](https://shopsavvy.com/answers/what-is-the-display-size-and-resolution-of-the-iphone-17-pro-max.md) |
| Recuo superior de segurança | 62 pt | **Estimativa.** Não confirmado para o 17 Pro. | Apenas um resumo automático citou 68 pt para o iPhone Air e 62 pt de forma indireta. |
| Recuo inferior (indicador de início) | 34 pt | **Estimativa.** A fonte cita a altura do indicador, não o recuo de segurança. | — |
| Dynamic Island | 126 × 37 pt, topo 11 pt | **Estimativa.** Rumores antes do lançamento divergiram sobre o tamanho final. | — |
| Raio da tela | 55 pt (17 Pro) / 62 pt (Pro Max) | **Estimativa** | — |

Para fechar as estimativas, medir no aparelho ou consultar a documentação de safe area da Apple (Human Interface Guidelines e SDK).

## Interface do Instagram (iOS)

| Item | Valor usado | Status |
|---|---|---|
| Barra de navegação | 44 pt, logo abaixo do recuo superior | Estimativa |
| Barra inferior | 49 pt + recuo inferior | Estimativa |
| Avatar do post | 32 pt | Estimativa |
| Ícones de ação | 24–26 pt, traço ~1,8 | Estimativa (ícones Lucide, não o conjunto oficial) |
| Azul de destaque | `#0095f6` | Estimativa (cor usada com frequência em análises de UI; não confirmada) |
| Curtir (coração) | `#ed4956` claro, `#ff3040` escuro | Estimativa |
| Texto e fundo | `#262626` / `#ffffff` (claro); `#f5f5f5` / `#000000` (escuro) | Estimativa |
| Separadores | `#dbdbdb` (claro), `#262626` (escuro) | Estimativa |
| Fonte | Pilha do sistema Apple (`-apple-system`, SF Pro) | Confirmado como escolha; não é a fonte oficial do aplicativo, que pode variar |

O logotipo do Instagram não é usado. A palavra "Instagram" aparece apenas como texto de navegação.

## Formatos de publicação

| Formato | Dimensão de exportação | Status | Fonte |
|---|---|---|---|
| 1:1 | 1080 × 1080 | Referência do projeto | `lib/instagram-image-optimizer.ts` |
| 4:5 | 1080 × 1350 | Referência do projeto | idem |
| 3:4 | 1080 × 1440 | Referência do projeto. Aceito no feed e em carrosséis segundo o próprio otimizador. | idem |
| 1,91:1 | 1080 × 566 | Referência do projeto | idem |
| Reel | 1080 × 1920 (9:16) | Referência do briefing | — |
| Carrossel contínuo | slides de 1080 px de largura, sem espaço entre eles | Regra do projeto | — |

## Limites

| Limite | Valor | Status | Fontes |
|---|---|---|---|
| Itens por carrossel | 20 (fotos e vídeos misturados) | Confirmado (imprensa especializada, agosto de 2024). Antes era 10. | [GSMArena](https://m.gsmarena.com/instagram_now_supports_up_to_20_photos_or_videos_in_carousel_posts-amp-64063.php), [TechRadar](https://www.techradar.com/computing/instagram/instagram-will-now-let-you-post-up-to-20-photos-or-videos-in-a-gallery-your-friends-should-be-thrilled), [PetaPixel](https://petapixel.com/2024/08/09/instagram-users-can-now-share-20-photos-videos-in-a-post-carousel-photodump) |
| Legenda | 2.200 caracteres | Referência do briefing; não reverificada nesta etapa | — |
| Grade do perfil | miniatura 3:4 com recorte central | Confirmado (terceiros, consistente). A data citada varia entre fontes (janeiro ou maio de 2025, ou final de 2025). | [Planoly](https://planoly.com/blog/guide-to-instagrams-new-vertical-grid), [Kapwing](https://www.kapwing.com/resources/instagrams-new-grid-layout-size-and-dimensions-2025/) |
| Feed com 3:4 | aceito | Confirmado (terceiros). Fontes divergem sobre o suporte ao 1,91:1 no feed. | idem |

## Decisões de implementação

- Uma única função de layout (`lib/instagram-post-simulator/layout.ts`) gera o enquadramento usado pela prévia (em porcentagem) e pelo exportador (em pixels). Os testes em `lib/__tests__/instagram-post-simulator.test.ts` verificam a continuidade do carrossel contínuo e a proporção do recorte.
- A janela da grade 3:4 é calculada sobre o quadro do post. Ajustar a capa na grade não altera o recorte do post.
- Filtros (brilho, contraste, saturação) têm nomes próprios. A prévia usa CSS, e o exportador reproduz a mesma matriz pixel a pixel. Os valores podem diferir ligeiramente entre navegadores.
- Vídeos: a prévia mostra o enquadramento escolhido; o download entrega o arquivo original, sem recorte nem transcodificação.
- Nada é enviado a servidores. Não há endpoint de upload, nem integração com a API do Instagram.
