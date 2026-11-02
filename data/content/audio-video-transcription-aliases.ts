import type { ContentBlock, FaqItem } from '@/types/content';
import type { AppLocale } from '@/lib/i18n/config';

export type AudioVideoTranscriptionAliasContent = {
  title: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  searchIntent: string;
  contentBlocks: ContentBlock[];
  faq: FaqItem[];
};

const pages: Partial<Record<AppLocale, Record<string, AudioVideoTranscriptionAliasContent>>> = {
  'pt-br': {
    'legendar-video-online': {
      title: 'Legendar Vídeo Online com Texto e Estilo Personalizados',
      intro:
        'Transcreva o áudio do vídeo, revise cada trecho com timestamp e gere uma nova versão com legendas gravadas na imagem. Ajuste posição, tamanho, cor e fonte antes de exportar.',
      seoTitle: 'Legendar Vídeo Online Grátis e Personalizar as Legendas',
      seoDescription:
        'Adicione legendas a um vídeo com transcrição local, ajuste texto, posição, tamanho, cor e fonte e exporte o resultado no navegador.',
      keywords: [
        'legendar vídeo online',
        'adicionar legenda ao vídeo',
        'gerar vídeo legendado',
        'personalizar legenda de vídeo',
        'legendas com timestamp',
      ],
      searchIntent:
        'Pessoas que querem transformar a fala de um vídeo em legendas sincronizadas, corrigir o texto e salvar uma cópia com as legendas visíveis.',
      contentBlocks: [
        {
          title: 'Da fala às legendas sincronizadas',
          paragraphs: [
            'Envie um vídeo e transcreva o áudio para criar trechos com marcações de tempo. A ferramenta organiza frases longas em linhas mais curtas para facilitar a leitura durante a reprodução. Antes de exportar, você pode revisar e corrigir cada trecho, inclusive nomes próprios ou palavras que o reconhecimento automático não entendeu bem.',
            'O editor mantém os tempos associados a cada trecho. Isso permite conferir uma fala no ponto certo do vídeo e corrigir o texto sem precisar refazer toda a transcrição. Repetições longas que parecem loops do reconhecimento são reduzidas automaticamente, mas a revisão continua importante para músicas, falas rápidas, sotaques e gravações com ruído.',
          ],
        },
        {
          title: 'Escolha como a legenda aparece',
          paragraphs: [
            'A prévia mostra a legenda sobre o vídeo enquanto ele toca. Escolha entre topo, centro e parte inferior, ajuste o tamanho do texto, selecione uma cor e alterne entre fontes sem serifa, com serifa ou monoespaçadas. Um fundo escuro opcional melhora a leitura quando há muitos detalhes atrás da fala.',
            'Essas opções ajudam a adaptar o resultado para vídeos verticais de redes sociais, aulas gravadas, entrevistas ou clipes curtos. O texto também pode ser editado antes da renderização. A posição e o estilo escolhidos são aplicados ao arquivo exportado, então as legendas continuam visíveis mesmo em players que não carregam arquivos de legenda separados.',
          ],
        },
        {
          title: 'Exportação local e limites',
          paragraphs: [
            'A renderização acontece no navegador, sem enviar o vídeo ou a transcrição para um servidor. O arquivo final é gravado em tempo real no aparelho; por isso, um vídeo de cinco minutos pode levar aproximadamente esse tempo para ser processado. Mantenha a página aberta e evite bloquear o dispositivo durante a exportação.',
            'O formato de saída depende do navegador e pode ser WebM ou MP4. A resolução é mantida até 1920 por 1080 pixels e o resultado pode ficar maior ou menor que o original, conforme a qualidade e a duração. Se o navegador não oferecer gravação de vídeo, baixe a legenda em SRT ou WebVTT para aplicar em outro editor.',
          ],
        },
      ],
      faq: [
        {
          question: 'Como colocar legendas gravadas dentro do vídeo?',
          answer:
            'Envie o vídeo, transcreva o áudio e escolha “Legendar vídeo” no resultado. Revise os textos, ajuste a aparência e gere uma nova cópia com as legendas visíveis na imagem.',
        },
        {
          question: 'Posso corrigir o texto antes de exportar?',
          answer:
            'Sim. Cada trecho tem um campo editável e seu timestamp. Corrija palavras, pontuação ou nomes antes de renderizar o vídeo.',
        },
        {
          question: 'A renderização funciona no celular?',
          answer:
            'Em navegadores móveis compatíveis, sim. O vídeo é renderizado no aparelho e em tempo real, então arquivos longos podem demorar e consumir bastante bateria. Se a exportação não estiver disponível, baixe SRT ou VTT.',
        },
        {
          question: 'Meu vídeo é enviado para algum servidor?',
          answer:
            'Não. A transcrição, a prévia e a gravação das legendas são feitas localmente no navegador. Apenas os arquivos do modelo de transcrição são baixados para o aparelho.',
        },
      ],
    },
  },
  en: {
    'add-subtitles-to-video': {
      title: 'Add Custom Subtitles to a Video Online',
      intro:
        'Transcribe a video, review each timestamped caption, then create a new copy with subtitles burned into the picture. Choose their position, size, color, and font before exporting.',
      seoTitle: 'Add Subtitles to Video Online and Customize Their Style',
      seoDescription:
        'Add subtitles to a video with local transcription, edit each caption, choose its position, size, color, and font, then export in your browser.',
      keywords: [
        'add subtitles to video',
        'burn subtitles into video online',
        'custom video captions',
        'edit timestamped subtitles',
        'caption a video online',
      ],
      searchIntent:
        'People who want synchronized captions from a video, need to correct the recognized words, and want a new copy with captions visible in the picture.',
      contentBlocks: [
        {
          title: 'Turn spoken audio into timed captions',
          paragraphs: [
            'Upload a video and transcribe its audio to create captions with timestamps. Long transcript chunks are split into shorter lines so viewers can read them while the video plays. Before exporting, review and edit each caption, including names or words that automatic speech recognition did not recognize correctly.',
            'Every caption keeps its time range, so you can check a sentence at the right point in the video and fix the wording without starting over. The transcription also reduces long repeated phrase loops, but review the result for songs, fast speech, accents, and noisy recordings.',
          ],
        },
        {
          title: 'Choose how captions look',
          paragraphs: [
            'The preview places captions over the video during playback. Choose the top, center, or bottom position, adjust text size, select a color, and use a sans-serif, serif, or monospace font. An optional dark background can make words easier to read over busy scenes.',
            'These controls help adapt the result to vertical social clips, recorded lessons, interviews, and short videos. You can edit the caption text before rendering as well. The selected appearance is applied to the exported file, so the captions remain visible in players that cannot load a separate subtitle track.',
          ],
        },
        {
          title: 'Local export and practical limits',
          paragraphs: [
            'Rendering happens in your browser without uploading the video or transcript. The final file is recorded on your device in real time, so a five-minute video can take about five minutes to process. Keep this page open and avoid locking the device while the export runs.',
            'The output format depends on browser support and may be WebM or MP4. Resolution is kept up to 1920 by 1080 pixels, and the finished file may be larger or smaller than the source based on quality and duration. If your browser cannot record video, download SRT or WebVTT and add it in another editor.',
          ],
        },
      ],
      faq: [
        {
          question: 'How do I burn subtitles into a video?',
          answer:
            'Upload a video, transcribe its audio, and choose “Add video subtitles” in the result. Review the captions, adjust their appearance, and create a new copy with text shown in the picture.',
        },
        {
          question: 'Can I correct the transcript before exporting?',
          answer:
            'Yes. Each caption has an editable text field and a timestamp. Correct words, punctuation, or names before rendering the video.',
        },
        {
          question: 'Does video rendering work on mobile?',
          answer:
            'It works in compatible mobile browsers. Rendering happens on the device in real time, so long videos may take a while and use battery. If recording is unavailable, download SRT or VTT instead.',
        },
        {
          question: 'Is my video uploaded to a server?',
          answer:
            'No. Transcription, preview, and caption rendering run locally in the browser. Only the transcription model files are downloaded to your device.',
        },
      ],
    },
  },
  es: {
    'poner-subtitulos-a-un-video': {
      title: 'Agregar Subtítulos Personalizados a un Video Online',
      intro:
        'Transcribe el video, revisa cada subtítulo con su marca de tiempo y crea una copia con el texto integrado en la imagen. Elige la posición, el tamaño, el color y la fuente antes de exportar.',
      seoTitle: 'Agregar Subtítulos a un Video Online y Personalizar el Estilo',
      seoDescription:
        'Agrega subtítulos a un video con transcripción local, edita cada texto, ajusta posición, tamaño, color y fuente y exporta desde el navegador.',
      keywords: [
        'poner subtítulos a un video',
        'integrar subtítulos en video online',
        'subtítulos personalizados para video',
        'editar subtítulos con timestamps',
        'subtitular video online',
      ],
      searchIntent:
        'Personas que quieren crear subtítulos sincronizados desde el audio de un video, corregir el texto reconocido y guardar una copia con el texto visible en la imagen.',
      contentBlocks: [
        {
          title: 'Convierte la voz en subtítulos sincronizados',
          paragraphs: [
            'Sube un video y transcribe el audio para crear subtítulos con marcas de tiempo. Los fragmentos largos se dividen en líneas más cortas para que se puedan leer durante la reproducción. Antes de exportar, revisa y corrige cada texto, incluidos los nombres o palabras que el reconocimiento automático no haya entendido bien.',
            'Cada subtítulo conserva su intervalo de tiempo. Así puedes revisar una frase en el punto exacto del video y corregir el texto sin repetir toda la transcripción. También se reducen los bucles largos de frases repetidas, pero conviene revisar canciones, voces rápidas, acentos y grabaciones con ruido.',
          ],
        },
        {
          title: 'Elige cómo se ven los subtítulos',
          paragraphs: [
            'La vista previa muestra los subtítulos sobre el video mientras se reproduce. Puedes ubicarlos arriba, en el centro o abajo, ajustar el tamaño, elegir un color y usar una fuente sin serifa, con serifa o monoespaciada. El fondo oscuro opcional ayuda a leer el texto sobre escenas con muchos detalles.',
            'Estos controles sirven para adaptar el resultado a videos verticales para redes, clases grabadas, entrevistas y clips cortos. También puedes editar cada texto antes de procesarlo. El estilo elegido se aplica al archivo exportado, por lo que los subtítulos se ven incluso en reproductores que no cargan una pista de subtítulos externa.',
          ],
        },
        {
          title: 'Exportación local y límites prácticos',
          paragraphs: [
            'El procesamiento se realiza en el navegador, sin subir el video ni la transcripción. El archivo final se graba en el dispositivo en tiempo real; por eso, un video de cinco minutos puede tardar unos cinco minutos en procesarse. Mantén esta página abierta y evita bloquear el dispositivo durante la exportación.',
            'El formato depende del navegador y puede ser WebM o MP4. La resolución se conserva hasta 1920 por 1080 píxeles, y el archivo final puede ser más grande o pequeño que el original según la calidad y duración. Si el navegador no permite grabar video, descarga SRT o WebVTT y aplícalo en otro editor.',
          ],
        },
      ],
      faq: [
        {
          question: '¿Cómo integrar subtítulos en un video?',
          answer:
            'Sube el video, transcribe el audio y elige “Subtitular video” en el resultado. Revisa los textos, ajusta su apariencia y crea una copia con los subtítulos visibles en la imagen.',
        },
        {
          question: '¿Puedo corregir la transcripción antes de exportar?',
          answer:
            'Sí. Cada fragmento tiene un campo de texto editable y una marca de tiempo. Corrige palabras, puntuación o nombres antes de procesar el video.',
        },
        {
          question: '¿El procesamiento funciona en el móvil?',
          answer:
            'Sí, en navegadores móviles compatibles. El video se procesa en el dispositivo y en tiempo real, por lo que los archivos largos pueden tardar y consumir batería. Si no está disponible, descarga SRT o VTT.',
        },
        {
          question: '¿Mi video se sube a un servidor?',
          answer:
            'No. La transcripción, la vista previa y la grabación de los subtítulos se realizan localmente en el navegador. Solo se descargan los archivos del modelo de transcripción.',
        },
      ],
    },
  },
};

export const getAudioVideoTranscriptionAliasContent = (
  slug: string,
  locale: AppLocale,
): AudioVideoTranscriptionAliasContent | undefined => pages[locale]?.[slug];
