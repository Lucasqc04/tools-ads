import type { ToolTranslation } from '@/data/i18n/tool-translations';

type MediaToolId = 'timelapse-creator' | 'audio-blaster';

export const newMediaTranslations: Record<'en' | 'es', Record<MediaToolId, ToolTranslation>> = {
  en: {
    'timelapse-creator': {
      name: 'Timelapse Video Creator',
      shortDescription: 'Turn long recordings into timelapses, set a different speed for each section, and export locally.',
      primaryKeyword: 'online timelapse video maker',
      secondaryKeywords: ['speed up video online', 'make a timelapse from video', 'change video speed by section', 'slow down part of a video', 'timelapse editor for large videos'],
      searchIntent: 'People turning long footage into a short timelapse or changing speed across selected parts of a video.',
      seoTitle: 'Online Timelapse Video Maker | Adjust Speed by Section',
      seoDescription: 'Create a timelapse from long videos, split the timeline, speed up or slow down sections, and export MP4 or WebM in your browser.',
      h1: 'Create a Timelapse Video and Set Speed for Each Section',
      intro: 'Speed up long videos, control playback speed for each section, and export an MP4 or WebM timelapse in your browser.',
      contentBlocks: [
        {
          title: 'Create a timelapse with section-level speed control',
          paragraphs: [
            'This timelapse video maker turns long recordings into short clips by changing playback speed. Upload footage of a build, drawing, plant, sky, trip, or routine, then choose how fast each part should play. The whole recording starts at 4× so you can see the effect right away, and each section can use its own speed.',
            'Split the timeline at the current preview position. Keep an introduction at normal speed, compress hours of work into a 16× section, and slow down the final moments to show the result clearly. You can also exclude a section from the exported video without changing the original file.',
          ],
        },
        {
          title: 'Set the duration, frame rate, and output format',
          paragraphs: [
            'The estimated final duration updates as you change speeds or remove sections. A ten-minute segment at 10× takes about one minute in the result, while a segment at 0.5× takes twice as long. This makes it easier to decide whether the timelapse fits a short social post or a longer demonstration before rendering.',
            'Choose 24, 30, or 60 frames per second, select high, balanced, or smaller-file quality, then export MP4 or WebM. MP4 is usually easier to share across social platforms. WebM is useful when the rest of your editing workflow already uses it.',
          ],
          list: [
            'Speed up the entire video or selected sections.',
            'Slow down a part to highlight a detail.',
            'Split the timeline at the preview playhead.',
            'Remove sections and estimate the final duration before rendering.',
          ],
        },
        {
          title: 'Local processing and limits for large videos',
          paragraphs: [
            'Your video is read, decoded, and encoded in the browser. The output is written to temporary local storage while it renders; the source video is not uploaded to the site. Export depends on WebCodecs, the codecs available in the browser, and free storage on your device.',
            'Files up to 10 GB can be selected, but device capability still matters. Resolution, duration, codec, memory, battery, and free space can affect processing time and completion. Long videos can take minutes or hours. Keep the page open during export because mobile browsers may pause background work. The exported timelapse is muted so the original audio does not drift out of sync or change pitch.',
          ],
        },
      ],
      faq: [
        { question: 'Can I speed up only part of a video?', answer: 'Yes. Pause at the point you want, split the selected section, then set a different speed for each segment. You can also keep, slow down, or exclude a section.' },
        { question: 'Can I use large video files?', answer: 'Files up to 10 GB can be selected and the export pipeline processes data locally. Success depends on browser codecs, memory, and free storage on your device.' },
        { question: 'Does the final video keep its original audio?', answer: 'No. The timelapse is exported without audio to avoid synchronization problems and abrupt pitch changes.' },
        { question: 'Which formats can I export?', answer: 'Choose MP4 or WebM, 24, 30, or 60 frames per second, and one of three quality levels.' },
        { question: 'Is my video uploaded to a server?', answer: 'No. Reading and rendering happen in the browser. Temporary output is written to local storage on your device.' },
      ],
    },
    'audio-blaster': {
      name: 'Audio Distortion and Clipping Tool',
      shortDescription: 'Upload audio or record with your microphone, add clipping, saturation, foldback, bitcrush, or a radio effect, then preview before export.',
      primaryKeyword: 'distort audio online for memes',
      secondaryKeywords: ['audio clipping tool online', 'make audio sound blown out', 'bitcrush audio online', 'radio voice effect online', 'meme audio distortion'],
      searchIntent: 'People uploading or recording a short sound, voice, or music snippet to intentionally distort it for a meme or comic effect.',
      seoTitle: 'Audio Distortion Tool Online | Clipping, Bitcrush, and Radio',
      seoDescription: 'Upload or record audio in your browser, add clipping, drive, foldback, bitcrush, or radio effects, then preview and export WAV or MP3 locally.',
      h1: 'Distort Audio for Memes with Clipping and Bitcrush Effects',
      intro: 'Upload an audio clip or record with your microphone, add clipping, saturation, foldback, bitcrush, or radio tone, and listen before downloading.',
      contentBlocks: [
        {
          title: 'Intentional audio distortion for memes',
          paragraphs: [
            'This audio distortion tool changes a voice, sound effect, or short music clip on purpose. Push the signal into clipping for the loud, square-edged sound often used in meme edits, or choose a more textured effect. Upload a short file or record a voice with your microphone, select a preset, and adjust gain, drive, and effect mix. A preview lets you hear the result before saving it.',
            'Hard clipping cuts off peaks. Soft saturation rounds them off. Foldback reflects the waveform once it passes its limit, producing harsher overtones. Bitcrush lowers sample resolution and holds sample values longer for an old video-game texture. Radio mode filters low and high frequencies to suggest a small speaker or megaphone.',
          ],
        },
        {
          title: 'Presets and controls for shaping the effect',
          paragraphs: [
            'Classic Clip, Bad Radio, 8-bit, and Meme Overdrive presets give you a quick starting point. Change the distortion mode, set gain from 0 to 30 dB, adjust drive and mix, then tune bit depth and sample reduction in bitcrush mode. More gain and drive usually create stronger distortion; lowering the mix keeps more of the original sound.',
            'Use a short spoken phrase for an exaggerated reaction, add bitcrush for a retro digital sound, or choose radio mode for a narrow, rough voice. Export WAV to avoid another lossy encoding step, or choose MP3 and set its bitrate for a smaller file that is easy to share.',
          ],
          list: [
            'Hard clipping for obvious peaks and a sharp sound.',
            'Soft saturation for a rounder edge.',
            'Foldback for an intense, irregular distortion.',
            'Bitcrush with adjustable resolution and sample hold.',
            'Radio and megaphone filtering for speech and short effects.',
          ],
        },
        {
          title: 'Supported files and privacy',
          paragraphs: [
            'Processing stays local: uploaded or recorded audio is decoded and changed in your browser, and it is not sent to the site server. Recording requires microphone permission. The preview is created as a WAV file. If you choose MP3, the browser loads a local encoder to make the smaller version; the first conversion may take a little longer.',
            'To keep editing responsive, files are limited to 100 MB and four minutes. Decoded audio can take much more memory than the original MP3 or M4A. If a codec cannot be decoded, convert the clip to MP3 or WAV and try again. Strong distortion can make speech harder to understand and create uncomfortable peaks, so lower playback volume before listening on loud speakers.',
          ],
        },
      ],
      faq: [
        { question: 'What does it mean to blow out or distort audio?', answer: 'It means intentionally clipping or saturating peaks to create a rough, distorted sound often used in memes and exaggerated voice effects.' },
        { question: 'Which effects are available?', answer: 'Choose hard clipping, soft saturation, foldback, bitcrush, or a radio/megaphone tone, with presets for a quick start.' },
        { question: 'Can I record with my microphone and listen before downloading?', answer: 'Yes. Allow microphone access to record a voice clip up to four minutes, or upload a file. The tool creates a WAV preview you can play before exporting as WAV or MP3.' },
        { question: 'Is my audio uploaded to a server?', answer: 'No. Decoding, effects, and preview generation happen locally in the browser.' },
        { question: 'What is the file limit?', answer: 'Each audio clip can be up to 100 MB and four minutes long to keep local memory use manageable.' },
      ],
    },
  },
  es: {
    'timelapse-creator': {
      name: 'Creador de Videos Timelapse',
      shortDescription: 'Convierte grabaciones largas en timelapses, ajusta la velocidad de cada tramo y exporta localmente.',
      primaryKeyword: 'crear video timelapse online',
      secondaryKeywords: ['acelerar video online', 'convertir video en timelapse', 'cambiar velocidad por tramo', 'ralentizar una parte del video', 'editor timelapse para videos grandes'],
      searchIntent: 'Personas que convierten grabaciones largas en timelapses cortos o cambian la velocidad de partes seleccionadas.',
      seoTitle: 'Creador de Videos Timelapse Online | Velocidad por Tramos',
      seoDescription: 'Crea un timelapse con videos largos, divide la línea de tiempo, acelera o ralentiza tramos y exporta MP4 o WebM en el navegador.',
      h1: 'Crea un Timelapse y Ajusta la Velocidad de Cada Tramo',
      intro: 'Acelera videos largos, controla la velocidad por tramo y exporta un timelapse MP4 o WebM directamente en el navegador.',
      contentBlocks: [
        {
          title: 'Crea un timelapse con velocidad por tramo',
          paragraphs: [
            'Este creador de timelapse convierte grabaciones largas en clips breves al cambiar la velocidad de reproducción. Añade una obra, un dibujo, una planta, el cielo, un viaje o una rutina y elige cuánto acelerar cada parte. Toda la grabación empieza a 4× para que veas un resultado de inmediato, y cada tramo puede tener su propia velocidad.',
            'Divide la línea de tiempo en la posición actual de la vista previa. Puedes dejar la introducción a velocidad normal, condensar horas de trabajo en un tramo a 16× y ralentizar los últimos segundos para mostrar el resultado. También puedes excluir un tramo del video final sin modificar el archivo original.',
          ],
        },
        {
          title: 'Ajusta duración, fluidez y formato',
          paragraphs: [
            'La duración final estimada se actualiza al cambiar velocidades o quitar tramos. Diez minutos a 10× ocupan aproximadamente un minuto en el resultado; un tramo a 0,5× dura el doble. Así puedes decidir si el timelapse encaja en una publicación breve o en una demostración más larga antes de renderizar.',
            'Elige 24, 30 o 60 cuadros por segundo, calidad alta, equilibrada o archivo ligero, y exporta MP4 o WebM. MP4 suele ser más sencillo de compartir en redes sociales. WebM puede servir si el resto de tu flujo de edición usa ese formato.',
          ],
          list: [
            'Acelerar el video completo o solo algunos tramos.',
            'Ralentizar una parte para destacar un detalle.',
            'Dividir la línea de tiempo en la posición de reproducción.',
            'Quitar intervalos y estimar la duración antes de renderizar.',
          ],
        },
        {
          title: 'Procesamiento local y límites para videos grandes',
          paragraphs: [
            'El video se lee, decodifica y codifica en el navegador. Durante el render, el resultado se escribe en almacenamiento temporal local; el video original no se sube al servidor. La exportación depende de WebCodecs, de los códecs disponibles y del espacio libre del dispositivo.',
            'Se pueden seleccionar archivos de hasta 10 GB, pero también influyen la resolución, duración, códec, memoria, batería y espacio disponible. Los videos largos pueden tardar minutos u horas. Mantén la página abierta durante la exportación, porque los navegadores móviles pueden pausar tareas en segundo plano. El timelapse se exporta sin audio para evitar problemas de sincronización o cambios de tono.',
          ],
        },
      ],
      faq: [
        { question: '¿Puedo acelerar solo una parte del video?', answer: 'Sí. Pausa en el punto deseado, divide el tramo seleccionado y define una velocidad distinta para cada segmento. También puedes mantenerlo, ralentizarlo o excluirlo.' },
        { question: '¿Admite videos grandes?', answer: 'Puedes seleccionar archivos de hasta 10 GB y el flujo de exportación trabaja localmente. El resultado depende de los códecs, memoria y espacio disponible.' },
        { question: '¿El video final conserva el audio original?', answer: 'No. El timelapse se exporta sin audio para evitar desfases y cambios bruscos de tono.' },
        { question: '¿Qué formatos puedo exportar?', answer: 'Puedes elegir MP4 o WebM, 24, 30 o 60 cuadros por segundo y tres niveles de calidad.' },
        { question: '¿El video se envía a un servidor?', answer: 'No. La lectura y el renderizado ocurren en el navegador. El resultado temporal se escribe en el almacenamiento local.' },
      ],
    },
    'audio-blaster': {
      name: 'Herramienta para Distorsionar Audio',
      shortDescription: 'Sube audio o graba con el micrófono, añade clipping, saturación, foldback, bitcrush o efecto de radio y escucha antes de exportar.',
      primaryKeyword: 'distorsionar audio online para memes',
      secondaryKeywords: ['herramienta clipping de audio', 'audio saturado para meme', 'efecto bitcrush online', 'efecto de voz de radio online', 'distorsión de audio meme'],
      searchIntent: 'Personas que suben o graban una voz, un sonido o un fragmento musical corto para distorsionarlo a propósito en un meme o efecto cómico.',
      seoTitle: 'Distorsionador de Audio Online | Clipping, Bitcrush y Radio',
      seoDescription: 'Sube o graba audio en el navegador, añade clipping, drive, foldback, bitcrush o efecto de radio y exporta WAV o MP3 localmente.',
      h1: 'Distorsiona Audio para Memes con Clipping y Bitcrush',
      intro: 'Sube un audio o graba con el micrófono, añade clipping, saturación, foldback, bitcrush o tono de radio y escúchalo antes de descargarlo.',
      contentBlocks: [
        {
          title: 'Distorsión intencional de audio para memes',
          paragraphs: [
            'Esta herramienta cambia a propósito una voz, un efecto o un fragmento musical corto. Lleva la señal al clipping para lograr el sonido fuerte y cuadrado habitual en ediciones de memes, o elige una textura diferente. Añade un archivo o graba una voz con el micrófono, selecciona un preset y ajusta ganancia, drive y mezcla del efecto. La vista previa te permite escuchar el resultado antes de guardarlo.',
            'El clipping seco corta los picos. La saturación suave los redondea. Foldback refleja la onda cuando supera el límite y crea armónicos ásperos. Bitcrush reduce la resolución y mantiene las muestras durante más tiempo para conseguir una textura de videojuego antiguo. El modo radio filtra graves y agudos para imitar un altavoz pequeño o un megáfono.',
          ],
        },
        {
          title: 'Presets y controles para ajustar el efecto',
          paragraphs: [
            'Estallido clásico, Radio vieja, 8 bits y Overdrive meme sirven como punto de partida. Después cambia el modo, ajusta ganancia de 0 a 30 dB, drive y mezcla; en bitcrush puedes modificar la profundidad de bits y la reducción de muestras. Más ganancia y drive suelen intensificar la distorsión, mientras que una mezcla menor conserva más del sonido original.',
            'Usa una frase corta para crear una reacción exagerada, añade bitcrush para una textura digital retro o elige radio para una voz áspera y estrecha. Exporta WAV para evitar otra compresión con pérdida, o elige MP3 y ajusta la tasa de bits para compartir un archivo más pequeño.',
          ],
          list: [
            'Clipping seco para picos notorios y sonido cortante.',
            'Saturación suave para un borde más redondo.',
            'Foldback para una distorsión intensa e irregular.',
            'Bitcrush con resolución y retención ajustables.',
            'Filtro de radio/megáfono para voces y efectos breves.',
          ],
        },
        {
          title: 'Archivos compatibles y privacidad',
          paragraphs: [
            'El procesamiento es local: el audio subido o grabado se decodifica y transforma en el navegador, sin enviarse al servidor del sitio. Para grabar, debes permitir el acceso al micrófono. La vista previa se genera como WAV. Si eliges MP3, el navegador carga un codificador local para crear la versión comprimida; la primera conversión puede tardar un poco más.',
            'Para mantener la edición ágil, cada archivo puede tener hasta 100 MB y cuatro minutos. El audio descomprimido ocupa mucha más memoria que el MP3 o M4A original. Si el navegador no decodifica un códec, convierte el clip a MP3 o WAV y vuelve a intentarlo. Una distorsión fuerte puede dificultar la comprensión y crear picos molestos, así que baja el volumen antes de escuchar en altavoces potentes.',
          ],
        },
      ],
      faq: [
        { question: '¿Qué significa reventar o distorsionar el audio?', answer: 'Es aplicar clipping o saturación a propósito para cortar picos y crear un sonido áspero, común en memes y voces exageradas.' },
        { question: '¿Qué efectos incluye?', answer: 'Puedes elegir clipping seco, saturación suave, foldback, bitcrush o tono de radio/megáfono, con presets para empezar rápido.' },
        { question: '¿Puedo grabar con el micrófono y escuchar antes de descargar?', answer: 'Sí. Permite el acceso al micrófono para grabar una voz de hasta cuatro minutos o sube un archivo. La herramienta crea una vista previa WAV que puedes escuchar antes de exportar en WAV o MP3.' },
        { question: '¿Mi audio se sube a un servidor?', answer: 'No. La decodificación, los efectos y la vista previa se procesan localmente en el navegador.' },
        { question: '¿Cuál es el límite del archivo?', answer: 'Cada audio puede tener hasta 100 MB y cuatro minutos para mantener bajo control la memoria local.' },
      ],
    },
  },
};
