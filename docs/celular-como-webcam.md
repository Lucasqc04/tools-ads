# Celular como Webcam

## Fluxo

O computador cria uma sessão temporária e mostra um QR Code. O link do celular carrega uma credencial aleatória no fragmento da URL (`#token=...`), que não é enviada em requisições HTTP. A página remove o fragmento do histórico assim que lê a credencial. O servidor guarda apenas o hash do token.

O celular solicita a câmera depois de um toque do usuário. Após a aprovação explícita no computador, os navegadores negociam SDP e candidatos ICE por uma fila curta no Upstash Redis e trocam vídeo diretamente com WebRTC. O Redis e as rotas Next.js nunca recebem a mídia. O pareamento aceita um telefone por sessão; um identificador aleatório vincula o primeiro pedido do telefone e impede que outra aba reutilize o mesmo token.

Na chamada QRTC, o vídeo recebido é clonado como faixa local e substitui a câmera selecionada nos peers da chamada. O telefone não precisa entrar na sala QRTC nem recebe acesso ao chat. A integração embutida transmite somente vídeo; o áudio opcional existe na página independente e começa desativado.

## Infraestrutura

As variáveis do Upstash existentes são reutilizadas:

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Se a instalação usa os nomes legados, `KV_REST_API_URL` e `KV_REST_API_TOKEN` também são aceitos. Sem Redis, a API responde como indisponível.

O STUN usa `SCREENSHARE_STUN_URLS` quando configurado e aceita uma lista separada por vírgulas. Sem essa variável, usa `stun:stun.l.google.com:19302`.

TURN é opcional. Para redes que bloqueiam conexões diretas, configure um serviço TURN compatível com credenciais REST HMAC:

```env
WEBRTC_TURN_URLS=turn:turn.example.com:3478,turns:turn.example.com:5349
WEBRTC_TURN_SHARED_SECRET=...
WEBRTC_TURN_CREDENTIAL_TTL_SECONDS=900
```

O serviço TURN precisa compartilhar o segredo com esta aplicação. Use credenciais temporárias e restrinja os limites de tráfego no próprio servidor TURN. A ferramenta não inclui hospedagem TURN nem cria um relay por conta própria.

Uma sessão tem TTL renovável de 30 minutos, limite absoluto de 4 horas e retenção de 60 segundos após encerrada. A API limita criação por endereço com fingerprint em hash, frequência de polling/sinalização, tamanho de mensagem e tamanho das filas. Cada poll e heartbeat consome chamadas da API e operações Redis; a sinalização e eventual tráfego TURN podem gerar custo. O tráfego de vídeo P2P direto não passa pela hospedagem da Tools.

## Captura no OBS

1. Abra a janela limpa na página do computador.
2. No OBS Studio, adicione uma fonte **Captura de Janela** e selecione essa janela do navegador.
3. Ajuste o enquadramento e inicie **Câmera Virtual** no OBS.
4. Selecione **OBS Virtual Camera** no aplicativo de chamada.

No Linux, a câmera virtual pode depender do `v4l2loopback` e da configuração do OBS da distribuição. A página fornece uma janela para captura; não instala uma câmera virtual nativa no sistema. A janela limpa usa o mesmo receptor WebRTC e não abre uma segunda conexão.

## Desenvolvimento e validação manual

Use HTTPS no endereço acessado pelo celular; `getUserMedia()` não funciona em uma origem insegura. Para uma verificação ponta a ponta, abra a página no computador e leia o QR Code com outro dispositivo. Confirme a câmera no celular pelo preview, aprove no computador e verifique se o vídeo chega à chamada ou à prévia limpa. Teste encerrar nos dois lados e bloquear a permissão da câmera.

Perfis de qualidade são valores ideais, não garantias. Os dados de resolução, FPS, bitrate, perda, ida e volta e rota só aparecem quando a API de estatísticas os fornece. Navegadores móveis podem suspender a captura em segundo plano ou quando a tela bloqueia; mantenha a página aberta e a tela ativa. P2P também pode expor o endereço IP entre os navegadores conectados.
