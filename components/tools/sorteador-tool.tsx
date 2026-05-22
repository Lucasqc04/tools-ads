"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  buildRangeItems,
  drawPickerResults,
  parsePickerItems,
  separatorLabelOrder,
  simulatePickerDistribution,
  type ParsedPickerItem,
  type PickerDrawMode,
  type PickerSeparatorMode,
} from "@/lib/random-picker";
import { cn } from "@/lib/cn";
import { type AppLocale } from "@/lib/i18n/config";

type SorteadorToolProps = Readonly<{
  locale?: AppLocale;
}>;

type DrawTab = "names" | "numbers" | "teams";

type Ui = {
  tabNames: string;
  tabNumbers: string;
  tabTeams: string;
  namesTitle: string;
  namesPlaceholder: string;
  numbersTitle: string;
  numbersDescription: string;
  rangeStartLabel: string;
  rangeEndLabel: string;
  teamsTitle: string;
  teamsDescription: string;
  teamsPlaceholder: string;
  teamsDivideInto: string;
  teamsLabel: string;
  groupsLabel: string;
  drawCountPrefix: string;
  drawCountSuffix: string;
  drawCountNumbers: string;
  optionsTitle: string;
  separatorLabel: string;
  autoSeparator: string;
  separatorNames: Record<Exclude<PickerSeparatorMode, "auto">, string>;
  dedupe: string;
  orderResults: string;
  countdownToggle: string;
  rouletteToggle: string;
  weightedToggle: string;
  shuffleBeforeDraw: string;
  avoidPreviousWinners: string;
  separationCriteria: string;
  drawButton: string;
  drawingButton: string;
  invalidDraw: string;
  parsedSummary: string;
  resultTitle: string;
  winnerLabel: string;
  copyResult: string;
  copyOrdered: string;
  downloadCsv: string;
  shareLink: string;
  copied: string;
  fairnessTitle: string;
  fairnessSeed: string;
  fairnessAlgorithm: string;
  simulationTitle: string;
  simulationDescription: string;
  simulateButton: string;
  simulationHits: string;
  simulationShare: string;
  localNote: string;
  copyError: string;
  shareError: string;
  teamResult: string;
};

const uiByLocale: Record<AppLocale, Ui> = {
  "pt-br": {
    tabNames: "Sorteio de Nomes",
    tabNumbers: "Sorteio de Numeros",
    tabTeams: "Sorteio de Equipes",
    namesTitle: "Sorteio de Nomes e Listas",
    namesPlaceholder: "Joao\nMaria\nPedro\nAna\nCarlos\nBeatriz",
    numbersTitle: "Sorteio de Numeros",
    numbersDescription: "Defina o intervalo de numeros para o sorteio.",
    rangeStartLabel: "De",
    rangeEndLabel: "Ate",
    teamsTitle: "Sorteio de Equipes",
    teamsDescription:
      "Informe abaixo a lista de participantes a ser sorteada:",
    teamsPlaceholder:
      "Um(a) participante por linha. Ex.:\nParticipante 1\nParticipante 2\nParticipante 3...",
    teamsDivideInto: "Dividir aleatoriamente os participantes acima em:",
    teamsLabel: "Equipes",
    groupsLabel: "Grupos",
    drawCountPrefix: "Sortear",
    drawCountSuffix: "item(ns) da lista abaixo:",
    drawCountNumbers: "numero(s)",
    optionsTitle: "Opcoes do Sorteio",
    separatorLabel: "Qual o criterio de separacao",
    autoSeparator: "Detectar automaticamente",
    separatorNames: {
      newline: "Quebra de Linha",
      comma: "Virgula",
      space: "Espaco",
      tab: "Tab",
      dot: "Ponto",
      pipe: "Pipe (|)",
      slash: "Barra (/)",
      semicolon: "Ponto e virgula",
    },
    dedupe: "Nao sortear nomes ja sorteados",
    orderResults: "Ordenar resultados em ordem crescente",
    countdownToggle: "Adicionar contagem regressiva (mais emocao)",
    rouletteToggle: "Ativar modo roleta visual",
    weightedToggle: "Aplicar pesos no sorteio",
    shuffleBeforeDraw: "Embaralhar antes de sortear",
    avoidPreviousWinners: "Nao sortear nomes ja sorteados",
    separationCriteria: "Qual o criterio de separacao",
    drawButton: "SORTEAR AGORA",
    drawingButton: "Sorteando...",
    invalidDraw: "Adicione pelo menos um item valido para sortear.",
    parsedSummary: "itens validos na lista",
    resultTitle: "Resultado do Sorteio",
    winnerLabel: "Sorteado",
    copyResult: "Copiar resultado",
    copyOrdered: "Copiar lista",
    downloadCsv: "Baixar CSV",
    shareLink: "Compartilhar link",
    copied: "Copiado",
    fairnessTitle: "Transparencia e Justica",
    fairnessSeed: "Seed",
    fairnessAlgorithm: "Algoritmo",
    simulationTitle: "Simulacao (1000 sorteios)",
    simulationDescription:
      "Valide a distribuicao e confira se os pesos estao corretos.",
    simulateButton: "Rodar simulacao",
    simulationHits: "Vezes",
    simulationShare: "%",
    localNote:
      "Processamento 100% local. Nenhum dado e enviado para servidor.",
    copyError: "Nao foi possivel copiar.",
    shareError: "Nao foi possivel gerar link.",
    teamResult: "Equipe",
  },
  en: {
    tabNames: "Name Draw",
    tabNumbers: "Number Draw",
    tabTeams: "Team Draw",
    namesTitle: "Name and List Draw",
    namesPlaceholder: "John\nMary\nPeter\nAnna\nCharles\nBeatrice",
    numbersTitle: "Number Draw",
    numbersDescription: "Set the number range for the draw.",
    rangeStartLabel: "From",
    rangeEndLabel: "To",
    teamsTitle: "Team Draw",
    teamsDescription: "Enter the list of participants below:",
    teamsPlaceholder:
      "One participant per line. E.g.:\nParticipant 1\nParticipant 2\nParticipant 3...",
    teamsDivideInto: "Randomly divide participants above into:",
    teamsLabel: "Teams",
    groupsLabel: "Groups",
    drawCountPrefix: "Draw",
    drawCountSuffix: "item(s) from the list below:",
    drawCountNumbers: "number(s)",
    optionsTitle: "Draw Options",
    separatorLabel: "Separation criteria",
    autoSeparator: "Auto detect",
    separatorNames: {
      newline: "Line break",
      comma: "Comma",
      space: "Space",
      tab: "Tab",
      dot: "Dot",
      pipe: "Pipe (|)",
      slash: "Slash (/)",
      semicolon: "Semicolon",
    },
    dedupe: "Exclude previously drawn names",
    orderResults: "Sort results ascending",
    countdownToggle: "Add countdown (more excitement)",
    rouletteToggle: "Enable wheel mode",
    weightedToggle: "Apply weights to draw",
    shuffleBeforeDraw: "Shuffle before draw",
    avoidPreviousWinners: "Exclude previously drawn names",
    separationCriteria: "Separation criteria",
    drawButton: "DRAW NOW",
    drawingButton: "Drawing...",
    invalidDraw: "Add at least one valid item to draw.",
    parsedSummary: "valid items in list",
    resultTitle: "Draw Result",
    winnerLabel: "Winner",
    copyResult: "Copy result",
    copyOrdered: "Copy list",
    downloadCsv: "Download CSV",
    shareLink: "Share link",
    copied: "Copied",
    fairnessTitle: "Transparency and Fairness",
    fairnessSeed: "Seed",
    fairnessAlgorithm: "Algorithm",
    simulationTitle: "Simulation (1000 draws)",
    simulationDescription:
      "Validate distribution and check if weights work correctly.",
    simulateButton: "Run simulation",
    simulationHits: "Hits",
    simulationShare: "%",
    localNote: "100% local processing. No data sent to server.",
    copyError: "Could not copy.",
    shareError: "Could not generate link.",
    teamResult: "Team",
  },
  es: {
    tabNames: "Sorteo de Nombres",
    tabNumbers: "Sorteo de Numeros",
    tabTeams: "Sorteo de Equipos",
    namesTitle: "Sorteo de Nombres y Listas",
    namesPlaceholder: "Juan\nMaria\nPedro\nAna\nCarlos\nBeatriz",
    numbersTitle: "Sorteo de Numeros",
    numbersDescription: "Define el rango de numeros para el sorteo.",
    rangeStartLabel: "Desde",
    rangeEndLabel: "Hasta",
    teamsTitle: "Sorteo de Equipos",
    teamsDescription: "Ingresa abajo la lista de participantes:",
    teamsPlaceholder:
      "Un participante por linea. Ej.:\nParticipante 1\nParticipante 2\nParticipante 3...",
    teamsDivideInto: "Dividir aleatoriamente los participantes en:",
    teamsLabel: "Equipos",
    groupsLabel: "Grupos",
    drawCountPrefix: "Sortear",
    drawCountSuffix: "item(s) de la lista:",
    drawCountNumbers: "numero(s)",
    optionsTitle: "Opciones del Sorteo",
    separatorLabel: "Criterio de separacion",
    autoSeparator: "Detectar automaticamente",
    separatorNames: {
      newline: "Salto de linea",
      comma: "Coma",
      space: "Espacio",
      tab: "Tab",
      dot: "Punto",
      pipe: "Pipe (|)",
      slash: "Barra (/)",
      semicolon: "Punto y coma",
    },
    dedupe: "No repetir nombres ya sorteados",
    orderResults: "Ordenar resultados ascendente",
    countdownToggle: "Agregar cuenta regresiva (mas emocion)",
    rouletteToggle: "Activar ruleta visual",
    weightedToggle: "Usar pesos en el sorteo",
    shuffleBeforeDraw: "Mezclar antes de sortear",
    avoidPreviousWinners: "No repetir nombres ya sorteados",
    separationCriteria: "Criterio de separacion",
    drawButton: "SORTEAR AHORA",
    drawingButton: "Sorteando...",
    invalidDraw: "Agrega al menos un item valido.",
    parsedSummary: "items validos en lista",
    resultTitle: "Resultado del Sorteo",
    winnerLabel: "Ganador",
    copyResult: "Copiar resultado",
    copyOrdered: "Copiar lista",
    downloadCsv: "Descargar CSV",
    shareLink: "Compartir enlace",
    copied: "Copiado",
    fairnessTitle: "Transparencia y Justicia",
    fairnessSeed: "Seed",
    fairnessAlgorithm: "Algoritmo",
    simulationTitle: "Simulacion (1000 sorteos)",
    simulationDescription: "Valida distribucion y verifica pesos.",
    simulateButton: "Ejecutar simulacion",
    simulationHits: "Veces",
    simulationShare: "%",
    localNote: "Procesamiento 100% local. No se envian datos al servidor.",
    copyError: "No fue posible copiar.",
    shareError: "No fue posible generar enlace.",
    teamResult: "Equipo",
  },
};

const checkboxClassName =
  "h-4 w-4 rounded border border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200";

const rouletteColors = [
  "#0f766e",
  "#2563eb",
  "#f97316",
  "#7c3aed",
  "#db2777",
  "#0ea5e9",
  "#65a30d",
  "#d97706",
  "#059669",
  "#0284c7",
  "#7e22ce",
  "#dc2626",
];

const defaultSourceInput =
  "Joao\nMaria\nPedro\nAna\nCarlos\nBeatriz\nRafael\nJulia";

const storageKey = "tool:sorteador:v2";

const formatPercent = (value: number): string =>
  `${(value * 100).toFixed(1)}%`;

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    globalThis.setTimeout(resolve, milliseconds);
  });

const normalizeLineBreaks = (value: string): string =>
  value.replace(/\r\n/g, "\n");

const parsePositiveInt = (value: string, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
};

const downloadText = (
  filename: string,
  content: string,
  mimeType: string,
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const csvFileNameByLocale: Record<AppLocale, string> = {
  "pt-br": "resultado-sorteio.csv",
  en: "draw-results.csv",
  es: "resultado-sorteo.csv",
};

const toResultsCsv = (
  results: ParsedPickerItem[],
  locale: AppLocale,
): string => {
  const header =
    locale === "en"
      ? "position,item\n"
      : locale === "es"
        ? "posicion,item\n"
        : "posicao,item\n";
  const rows = results
    .map(
      (item, index) =>
        `${index + 1},"${item.label.replaceAll('"', '""')}"`,
    )
    .join("\n");
  return `${header}${rows}`;
};

const toOrderedText = (results: ParsedPickerItem[]): string =>
  results.map((item, index) => `${index + 1}. ${item.label}`).join("\n");

const fairnessAlgorithmByLocale: Record<AppLocale, string> = {
  "pt-br":
    "crypto.getRandomValues + rejection sampling + pesos opcionais",
  en: "crypto.getRandomValues + rejection sampling + optional weights",
  es: "crypto.getRandomValues + rejection sampling + pesos opcionales",
};

export function SorteadorTool({ locale = "pt-br" }: SorteadorToolProps) {
  const ui = uiByLocale[locale];

  const [activeTab, setActiveTab] = useState<DrawTab>("names");
  const [sourceInput, setSourceInput] = useState(defaultSourceInput);
  const [separatorMode, setSeparatorMode] =
    useState<PickerSeparatorMode>("newline");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [trimSpaces] = useState(true);
  const [ignoreEmpty] = useState(true);
  const [parseWeights, setParseWeights] = useState(false);
  const [drawMode] = useState<PickerDrawMode>("without-repetition");
  const [resultCountInput, setResultCountInput] = useState("1");
  const [useCountdown, setUseCountdown] = useState(true);
  const [useRoulette, setUseRoulette] = useState(false);
  const [useWeights, setUseWeights] = useState(false);
  const [shuffleBeforeDraw, setShuffleBeforeDraw] = useState(false);
  const [avoidPreviousWinners, setAvoidPreviousWinners] = useState(false);
  const [orderResults, setOrderResults] = useState(false);
  const [historyNormalized, setHistoryNormalized] = useState<string[]>([]);
  const [rangeStartInput, setRangeStartInput] = useState("1");
  const [rangeEndInput, setRangeEndInput] = useState("100");
  const [teamCount, setTeamCount] = useState("2");
  const [teamDivisionMode, setTeamDivisionMode] = useState<
    "teams" | "groups"
  >("teams");
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingLabel, setRollingLabel] = useState("");
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [resultItems, setResultItems] = useState<ParsedPickerItem[]>([]);
  const [teamResults, setTeamResults] = useState<ParsedPickerItem[][]>([]);
  const [resultSeed, setResultSeed] = useState("");
  const [resultAlgorithm, setResultAlgorithm] = useState("");
  const [simulationRows, setSimulationRows] = useState<
    Array<{ label: string; hits: number; share: number }>
  >([]);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const sourceForParsing =
    activeTab === "numbers"
      ? buildRangeItems(Number(rangeStartInput), Number(rangeEndInput))
          .map((i) => i.label)
          .join("\n")
      : sourceInput;

  const parsed = useMemo(
    () =>
      parsePickerItems(sourceForParsing, {
        separatorMode: activeTab === "numbers" ? "newline" : separatorMode,
        trimSpaces,
        ignoreEmpty,
        removeDuplicates,
        parseWeights,
      }),
    [
      sourceForParsing,
      activeTab,
      separatorMode,
      trimSpaces,
      ignoreEmpty,
      removeDuplicates,
      parseWeights,
    ],
  );

  const blockedSet = useMemo(() => {
    if (!avoidPreviousWinners) return undefined;
    return new Set(historyNormalized);
  }, [avoidPreviousWinners, historyNormalized]);

  const poolItems = useMemo(
    () =>
      parsed.items.filter(
        (item) => !blockedSet || !blockedSet.has(item.normalized),
      ),
    [parsed.items, blockedSet],
  );

  const rouletteSegments = useMemo(
    () => poolItems.slice(0, 12),
    [poolItems],
  );

  // Load from localStorage
  useEffect(() => {
    const fromUrl = new URLSearchParams(globalThis.location.search);
    if (fromUrl.size) {
      const itemsParam = fromUrl.get("items");
      if (itemsParam) setSourceInput(normalizeLineBreaks(itemsParam));
      const nextSep = fromUrl.get("sep") as PickerSeparatorMode | null;
      if (nextSep) setSeparatorMode(nextSep);
      const nextCount = fromUrl.get("count");
      if (nextCount) setResultCountInput(nextCount);
      setUseRoulette(fromUrl.get("wheel") === "1");
      setUseWeights(fromUrl.get("weights") === "1");
      const nextTab = fromUrl.get("tab") as DrawTab | null;
      if (nextTab) setActiveTab(nextTab);
      return;
    }

    const stored = globalThis.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const p = JSON.parse(stored) as Record<string, unknown>;
      if (p.sourceInput && typeof p.sourceInput === "string")
        setSourceInput(p.sourceInput);
      if (p.separatorMode)
        setSeparatorMode(p.separatorMode as PickerSeparatorMode);
      if (p.resultCountInput && typeof p.resultCountInput === "string")
        setResultCountInput(p.resultCountInput);
      if (typeof p.useRoulette === "boolean") setUseRoulette(p.useRoulette);
      if (typeof p.useWeights === "boolean") setUseWeights(p.useWeights);
      if (typeof p.avoidPreviousWinners === "boolean")
        setAvoidPreviousWinners(p.avoidPreviousWinners);
      if (p.activeTab) setActiveTab(p.activeTab as DrawTab);
      if (p.rangeStartInput && typeof p.rangeStartInput === "string")
        setRangeStartInput(p.rangeStartInput);
      if (p.rangeEndInput && typeof p.rangeEndInput === "string")
        setRangeEndInput(p.rangeEndInput);
      if (p.teamCount && typeof p.teamCount === "string")
        setTeamCount(p.teamCount);
    } catch {
      globalThis.localStorage.removeItem(storageKey);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const payload = {
      sourceInput,
      separatorMode,
      resultCountInput,
      useRoulette,
      useWeights,
      avoidPreviousWinners,
      activeTab,
      rangeStartInput,
      rangeEndInput,
      teamCount,
    };
    globalThis.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [
    sourceInput,
    separatorMode,
    resultCountInput,
    useRoulette,
    useWeights,
    avoidPreviousWinners,
    activeTab,
    rangeStartInput,
    rangeEndInput,
    teamCount,
  ]);

  const safeRequestedCount =
    activeTab === "teams"
      ? poolItems.length
      : parsePositiveInt(resultCountInput, 1);

  const runDraw = async () => {
    if (!poolItems.length) {
      setErrorMessage(ui.invalidDraw);
      return;
    }

    setErrorMessage("");
    setFeedbackMessage("");
    setSimulationRows([]);
    setTeamResults([]);

    const delayMs = useCountdown ? 3000 : 0;

    if (delayMs > 0) {
      setIsDrawing(true);
      const ticker = globalThis.setInterval(() => {
        const next =
          poolItems[Math.floor(Math.random() * poolItems.length)];
        setRollingLabel(next?.label ?? "...");
      }, 90);

      if (useRoulette) {
        setRouletteRotation(
          (current) =>
            current + 1440 + Math.floor(Math.random() * 480),
        );
      }

      await wait(delayMs);
      globalThis.clearInterval(ticker);
    }

    if (activeTab === "teams") {
      const draw = drawPickerResults({
        items: parsed.items,
        mode: "shuffle",
        requestedCount: poolItems.length,
        weighted: false,
        shuffleBeforeDraw: true,
        blockedNormalizedLabels: blockedSet,
      });

      const numTeams = parsePositiveInt(teamCount, 2);
      const teams: ParsedPickerItem[][] = Array.from(
        { length: numTeams },
        () => [],
      );
      draw.results.forEach((item, index) => {
        teams[index % numTeams]!.push(item);
      });

      setTeamResults(teams);
      setResultItems(draw.results);
      setResultSeed(draw.seed);
      setResultAlgorithm(
        fairnessAlgorithmByLocale[locale] || draw.algorithm,
      );
      setIsDrawing(false);
      setRollingLabel("");
      return;
    }

    const draw = drawPickerResults({
      items: parsed.items,
      mode: drawMode,
      requestedCount: safeRequestedCount,
      weighted: useWeights,
      shuffleBeforeDraw,
      blockedNormalizedLabels: blockedSet,
    });

    let results = draw.results;
    if (orderResults) {
      results = [...results].sort((a, b) =>
        a.label.localeCompare(b.label, locale),
      );
    }

    setIsDrawing(false);
    setResultItems(results);
    setResultSeed(draw.seed);
    setResultAlgorithm(
      fairnessAlgorithmByLocale[locale] || draw.algorithm,
    );
    setRollingLabel(results[0]?.label ?? "");

    if (avoidPreviousWinners && results.length) {
      setHistoryNormalized((current) =>
        Array.from(
          new Set([
            ...current,
            ...results.map((item) => item.normalized),
          ]),
        ),
      );
    }
  };

  const copyText = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setFeedbackMessage(ui.copied);
      globalThis.setTimeout(() => setFeedbackMessage(""), 1400);
    } catch {
      setFeedbackMessage(ui.copyError);
    }
  };

  const copyShareLink = async () => {
    try {
      const query = new URLSearchParams();
      query.set("items", sourceForParsing);
      query.set("tab", activeTab);
      query.set("sep", separatorMode);
      query.set("count", String(safeRequestedCount));
      query.set("wheel", useRoulette ? "1" : "0");
      query.set("weights", useWeights ? "1" : "0");
      const shareUrl = `${globalThis.location.origin}${globalThis.location.pathname}?${query.toString()}`;
      await navigator.clipboard.writeText(shareUrl);
      setFeedbackMessage(ui.copied);
      globalThis.setTimeout(() => setFeedbackMessage(""), 1400);
    } catch {
      setFeedbackMessage(ui.shareError);
    }
  };

  const runSimulation = () => {
    if (!poolItems.length) {
      setErrorMessage(ui.invalidDraw);
      return;
    }
    setErrorMessage("");
    const output = simulatePickerDistribution(poolItems, 1000, useWeights);
    setSimulationRows(output.slice(0, 12));
  };

  const wheelBackground = useMemo(() => {
    if (!rouletteSegments.length)
      return "radial-gradient(circle at center, #f8fafc, #e2e8f0)";
    const angle = 360 / rouletteSegments.length;
    const segments = rouletteSegments.map((_, index) => {
      const color = rouletteColors[index % rouletteColors.length] as string;
      const start = Math.round(index * angle * 100) / 100;
      const end = Math.round((index + 1) * angle * 100) / 100;
      return `${color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${segments.join(", ")})`;
  }, [rouletteSegments]);

  const tabs: { id: DrawTab; label: string }[] = [
    { id: "names", label: ui.tabNames },
    { id: "numbers", label: ui.tabNumbers },
    { id: "teams", label: ui.tabTeams },
  ];

  return (
    <Card className="space-y-0 overflow-hidden">
      {/* Tab navigation */}
      <nav className="flex border-b border-slate-200 bg-slate-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setResultItems([]);
              setTeamResults([]);
              setSimulationRows([]);
              setErrorMessage("");
            }}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-semibold transition border-b-2",
              activeTab === tab.id
                ? "border-brand-600 text-brand-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Mode: Names */}
        {activeTab === "names" && (
          <section className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {ui.namesTitle}
              </h3>
              <div className="flex items-center justify-center gap-2 text-slate-700">
                <span>{ui.drawCountPrefix}</span>
                <Input
                  inputMode="numeric"
                  value={resultCountInput}
                  onChange={(e) => setResultCountInput(e.target.value)}
                  className="w-16 text-center font-bold"
                />
                <span>{ui.drawCountSuffix}</span>
              </div>
            </div>

            <Textarea
              rows={8}
              value={sourceInput}
              placeholder={ui.namesPlaceholder}
              onChange={(e) => setSourceInput(e.target.value)}
              className="text-base"
            />

            <p className="text-center text-sm text-slate-500">
              <strong className="text-slate-700">{poolItems.length}</strong>{" "}
              {ui.parsedSummary}
            </p>
          </section>
        )}

        {/* Mode: Numbers */}
        {activeTab === "numbers" && (
          <section className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {ui.numbersTitle}
              </h3>
              <p className="text-sm text-slate-600">
                {ui.numbersDescription}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">
                  {ui.rangeStartLabel}
                </span>
                <Input
                  inputMode="numeric"
                  value={rangeStartInput}
                  onChange={(e) => setRangeStartInput(e.target.value)}
                  className="w-28 text-center text-lg font-bold"
                />
              </label>
              <label className="space-y-1">
                <span className="text-sm font-medium text-slate-700">
                  {ui.rangeEndLabel}
                </span>
                <Input
                  inputMode="numeric"
                  value={rangeEndInput}
                  onChange={(e) => setRangeEndInput(e.target.value)}
                  className="w-28 text-center text-lg font-bold"
                />
              </label>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-700">
              <span>{ui.drawCountPrefix}</span>
              <Input
                inputMode="numeric"
                value={resultCountInput}
                onChange={(e) => setResultCountInput(e.target.value)}
                className="w-16 text-center font-bold"
              />
              <span>{ui.drawCountNumbers}</span>
            </div>

            <p className="text-center text-sm text-slate-500">
              <strong className="text-slate-700">{poolItems.length}</strong>{" "}
              {ui.parsedSummary}
            </p>
          </section>
        )}

        {/* Mode: Teams */}
        {activeTab === "teams" && (
          <section className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {ui.teamsTitle}
              </h3>
              <p className="text-sm text-slate-600">
                {ui.teamsDescription}
              </p>
            </div>

            <Textarea
              rows={8}
              value={sourceInput}
              placeholder={ui.teamsPlaceholder}
              onChange={(e) => setSourceInput(e.target.value)}
              className="text-base"
            />

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-700">
                {ui.teamsDivideInto}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Input
                  inputMode="numeric"
                  value={teamCount}
                  onChange={(e) => setTeamCount(e.target.value)}
                  className="w-16 text-center text-lg font-bold"
                />
                <Select
                  value={teamDivisionMode}
                  onChange={(e) =>
                    setTeamDivisionMode(
                      e.target.value as "teams" | "groups",
                    )
                  }
                  className="w-32"
                >
                  <option value="teams">{ui.teamsLabel}</option>
                  <option value="groups">{ui.groupsLabel}</option>
                </Select>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              <strong className="text-slate-700">{poolItems.length}</strong>{" "}
              {ui.parsedSummary}
            </p>
          </section>
        )}

        {/* Options section - collapsible */}
        <section className="rounded-xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setOptionsOpen((c) => !c)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 transition"
          >
            <span>{ui.optionsTitle}</span>
            <svg
              className={cn(
                "h-4 w-4 text-slate-500 transition-transform",
                optionsOpen && "rotate-180",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {optionsOpen && (
            <div className="p-4 space-y-4 border-t border-slate-200 bg-white">
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={orderResults}
                    onChange={(e) => setOrderResults(e.target.checked)}
                  />
                  {ui.orderResults}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={useCountdown}
                    onChange={(e) => setUseCountdown(e.target.checked)}
                  />
                  {ui.countdownToggle}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={useRoulette}
                    onChange={(e) => setUseRoulette(e.target.checked)}
                  />
                  {ui.rouletteToggle}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={avoidPreviousWinners}
                    onChange={(e) =>
                      setAvoidPreviousWinners(e.target.checked)
                    }
                  />
                  {ui.avoidPreviousWinners}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={useWeights}
                    onChange={(e) => setUseWeights(e.target.checked)}
                  />
                  {ui.weightedToggle}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={removeDuplicates}
                    onChange={(e) =>
                      setRemoveDuplicates(e.target.checked)
                    }
                  />
                  {ui.dedupe}
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={shuffleBeforeDraw}
                    onChange={(e) =>
                      setShuffleBeforeDraw(e.target.checked)
                    }
                  />
                  {ui.shuffleBeforeDraw}
                </label>
              </div>

              {/* Separation criteria */}
              {activeTab !== "numbers" && (
                <fieldset className="space-y-2 border-t border-slate-100 pt-3">
                  <legend className="text-sm font-semibold text-slate-800">
                    {ui.separationCriteria}
                  </legend>
                  {(["newline", "comma"] as const).map((sep) => (
                    <label
                      key={sep}
                      className="flex items-center gap-3 text-sm text-slate-700"
                    >
                      <input
                        type="radio"
                        name="separator"
                        className="h-4 w-4 border-slate-300 text-brand-600"
                        checked={separatorMode === sep}
                        onChange={() => setSeparatorMode(sep)}
                      />
                      {ui.separatorNames[sep]}
                    </label>
                  ))}
                  <label className="flex items-center gap-3 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="separator"
                      className="h-4 w-4 border-slate-300 text-brand-600"
                      checked={
                        separatorMode !== "newline" &&
                        separatorMode !== "comma"
                      }
                      onChange={() => setSeparatorMode("auto")}
                    />
                    {ui.autoSeparator}
                  </label>
                </fieldset>
              )}
            </div>
          )}
        </section>

        {/* Error/feedback messages */}
        {errorMessage && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
            {errorMessage}
          </p>
        )}
        {feedbackMessage && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 text-center">
            {feedbackMessage}
          </p>
        )}

        {/* Big draw button */}
        <Button
          variant="primary"
          className="w-full py-4 text-lg font-bold uppercase tracking-wide rounded-xl"
          onClick={() => {
            void runDraw();
          }}
          disabled={isDrawing || !poolItems.length}
        >
          {isDrawing ? ui.drawingButton : ui.drawButton}
        </Button>

        {/* Roulette wheel */}
        {useRoulette && poolItems.length > 1 && (
          <section className="flex justify-center py-4">
            <div className="relative h-56 w-56 sm:h-64 sm:w-64">
              <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-l-8 border-r-8 border-t-[14px] border-l-transparent border-r-transparent border-t-slate-900" />
              <div
                className="absolute inset-0 rounded-full border-4 border-white shadow-lg"
                style={{
                  background: wheelBackground,
                  transform: `rotate(${rouletteRotation}deg)`,
                  transition: isDrawing
                    ? "transform 3s cubic-bezier(0.12, 0.92, 0.15, 1)"
                    : "none",
                }}
              />
              <div className="absolute inset-[28%] z-10 flex items-center justify-center rounded-full border border-slate-200 bg-white/95 p-3 text-center text-sm font-bold text-slate-800">
                {rollingLabel || resultItems[0]?.label || "---"}
              </div>
            </div>
          </section>
        )}

        {/* Results section */}
        {(resultItems.length > 0 || teamResults.length > 0) && (
          <section className="space-y-4 rounded-xl border-2 border-brand-200 bg-brand-50/30 p-4 sm:p-6">
            <h4 className="text-lg font-bold text-slate-900 text-center">
              {ui.resultTitle}
            </h4>

            {/* Team results */}
            {teamResults.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {teamResults.map((team, teamIndex) => (
                  <div
                    key={teamIndex}
                    className="rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <p className="text-sm font-bold text-brand-700 mb-2">
                      {ui.teamResult} {teamIndex + 1}
                    </p>
                    <ul className="space-y-1">
                      {team.map((member, memberIndex) => (
                        <li
                          key={member.id + memberIndex}
                          className="text-sm text-slate-700"
                        >
                          {member.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Single/list results */}
            {teamResults.length === 0 && resultItems.length > 0 && (
              <>
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {ui.winnerLabel}
                  </p>
                  <p className="mt-1 break-words text-2xl font-bold text-emerald-900">
                    {resultItems[0]?.label}
                  </p>
                </div>

                {resultItems.length > 1 && (
                  <ol className="space-y-1">
                    {resultItems.map((item, index) => (
                      <li
                        key={`${item.id}-${index}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                      >
                        <strong className="text-brand-600">
                          {index + 1}.
                        </strong>{" "}
                        {item.label}
                      </li>
                    ))}
                  </ol>
                )}
              </>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() =>
                  void copyText(
                    resultItems.map((i) => i.label).join("\n"),
                  )
                }
              >
                {ui.copyResult}
              </Button>
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() =>
                  void copyText(toOrderedText(resultItems))
                }
              >
                {ui.copyOrdered}
              </Button>
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() =>
                  downloadText(
                    csvFileNameByLocale[locale],
                    toResultsCsv(resultItems, locale),
                    "text/csv;charset=utf-8;",
                  )
                }
              >
                {ui.downloadCsv}
              </Button>
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => void copyShareLink()}
              >
                {ui.shareLink}
              </Button>
            </div>
          </section>
        )}

        {/* Fairness info */}
        {resultSeed && (
          <details className="rounded-xl border border-slate-200 bg-white">
            <summary className="px-4 py-2 text-sm font-semibold text-slate-800 cursor-pointer">
              {ui.fairnessTitle}
            </summary>
            <div className="px-4 pb-3 text-xs text-slate-600 space-y-1">
              <p>
                <strong>{ui.fairnessSeed}:</strong> {resultSeed}
              </p>
              <p>
                <strong>{ui.fairnessAlgorithm}:</strong>{" "}
                {resultAlgorithm}
              </p>
            </div>
          </details>
        )}

        {/* Simulation */}
        <details className="rounded-xl border border-slate-200 bg-slate-50">
          <summary className="px-4 py-2 text-sm font-semibold text-slate-800 cursor-pointer">
            {ui.simulationTitle}
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-slate-600">
              {ui.simulationDescription}
            </p>
            <Button
              variant="secondary"
              className="text-xs"
              onClick={runSimulation}
              disabled={!poolItems.length}
            >
              {ui.simulateButton}
            </Button>
            {simulationRows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-2 py-1">Item</th>
                      <th className="px-2 py-1">
                        {ui.simulationHits}
                      </th>
                      <th className="px-2 py-1">
                        {ui.simulationShare}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationRows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-slate-100"
                      >
                        <td className="px-2 py-1">{row.label}</td>
                        <td className="px-2 py-1">{row.hits}</td>
                        <td className="px-2 py-1">
                          {formatPercent(row.share)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </details>

        <p className="text-center text-xs text-slate-500">
          {ui.localNote}
        </p>
      </div>
    </Card>
  );
}
