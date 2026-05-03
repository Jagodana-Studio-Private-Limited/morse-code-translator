"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Play, Square, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolEvents } from "@/lib/analytics";

const MORSE_MAP: Record<string, string> = {
  A: ".-",    B: "-...",  C: "-.-.",  D: "-..",   E: ".",
  F: "..-.",  G: "--.",   H: "....",  I: "..",    J: ".---",
  K: "-.-",   L: ".-..",  M: "--",    N: "-.",    O: "---",
  P: ".--.",  Q: "--.-",  R: ".-.",   S: "...",   T: "-",
  U: "..-",   V: "...-",  W: ".--",   X: "-..-",  Y: "-.--",
  Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.",  "(": "-.--.",  ")": "-.--.-",
  "&": ".-...",  ":": "---...", ";": "-.-.-.",  "=": "-...-",
  "+": ".-.-.",  "-": "-....-", "_": "..--.-",  '"': ".-..-.",
  "$": "...-..-","@": ".--.-.",
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

type BreakdownItem = { top: string; bottom: string };

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return "/";
      return MORSE_MAP[ch] ?? "?";
    })
    .join(" ");
}

function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*|\s{3,}/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => REVERSE_MAP[code] ?? "?")
        .join("")
    )
    .join(" ");
}

function buildEncodeBreakdown(text: string): BreakdownItem[] {
  return text
    .toUpperCase()
    .split("")
    .map((ch) => ({
      top: ch === " " ? "SPC" : ch,
      bottom: ch === " " ? "/" : (MORSE_MAP[ch] ?? "?"),
    }));
}

function buildDecodeBreakdown(morse: string): BreakdownItem[] {
  const items: BreakdownItem[] = [];
  const words = morse.trim().split(/\s*\/\s*|\s{3,}/);
  words.forEach((word, wi) => {
    word
      .trim()
      .split(/\s+/)
      .forEach((code) => {
        items.push({ top: code, bottom: REVERSE_MAP[code] ?? "?" });
      });
    if (wi < words.length - 1) {
      items.push({ top: "/", bottom: "SPC" });
    }
  });
  return items;
}

type PlayState = "idle" | "playing";

export function MorseCodeTranslatorTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [wpm, setWpm] = useState(15);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const stopRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const morseOutput = mode === "encode" ? textToMorse(input) : "";
  const textOutput = mode === "decode" ? morseToText(input) : "";
  const breakdown: BreakdownItem[] =
    mode === "encode" && input
      ? buildEncodeBreakdown(input)
      : mode === "decode" && input
      ? buildDecodeBreakdown(input)
      : [];

  const displayOutput = mode === "encode" ? morseOutput : textOutput;
  const morseForAudio = mode === "encode" ? morseOutput : input;

  const handleCopy = useCallback(
    (output: string) => {
      if (!output) return;
      navigator.clipboard.writeText(output).then(() => {
        toast.success("Copied to clipboard!");
        ToolEvents.resultCopied();
      });
    },
    []
  );

  const handleReset = useCallback(() => {
    setInput("");
    stopRef.current = true;
    setPlayState("idle");
  }, []);

  const handleModeChange = useCallback((v: string) => {
    setMode(v as "encode" | "decode");
    setInput("");
    stopRef.current = true;
    setPlayState("idle");
  }, []);

  const playMorse = useCallback(async () => {
    if (!morseForAudio || playState === "playing") return;
    stopRef.current = false;
    setPlayState("playing");
    ToolEvents.toolUsed("play-audio");

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const dotDuration = 1.2 / wpm;

    for (const symbol of morseForAudio.split("")) {
      if (stopRef.current) break;
      if (symbol === "." || symbol === "-") {
        const duration = symbol === "." ? dotDuration : dotDuration * 3;
        await new Promise<void>((resolve) => {
          if (stopRef.current) { resolve(); return; }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 700;
          osc.type = "sine";
          const start = ctx.currentTime + 0.01;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(0.4, start + 0.005);
          gain.gain.linearRampToValueAtTime(0.4, start + duration - 0.005);
          gain.gain.linearRampToValueAtTime(0, start + duration);
          osc.start(start);
          osc.stop(start + duration);
          osc.onended = () => resolve();
        });
        await new Promise<void>((r) =>
          setTimeout(r, stopRef.current ? 0 : dotDuration * 1000)
        );
      } else if (symbol === " ") {
        await new Promise<void>((r) =>
          setTimeout(r, stopRef.current ? 0 : dotDuration * 2 * 1000)
        );
      } else if (symbol === "/") {
        await new Promise<void>((r) =>
          setTimeout(r, stopRef.current ? 0 : dotDuration * 4 * 1000)
        );
      }
    }
    setPlayState("idle");
  }, [morseForAudio, wpm, playState]);

  const stopAudio = useCallback(() => {
    stopRef.current = true;
    setPlayState("idle");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-3xl mx-auto"
    >
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="encode" className="flex-1">
            Text → Morse
          </TabsTrigger>
          <TabsTrigger value="decode" className="flex-1">
            Morse → Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4">
          <ToolPanel
            inputLabel="Enter text"
            inputPlaceholder="Type something… e.g. Hello World"
            input={input}
            onInputChange={setInput}
            outputLabel="Morse code output"
            output={morseOutput}
            breakdown={breakdown}
            wpm={wpm}
            onWpmChange={setWpm}
            playState={playState}
            onPlay={playMorse}
            onStop={stopAudio}
            onCopy={() => handleCopy(morseOutput)}
            onReset={handleReset}
            hint={null}
          />
        </TabsContent>

        <TabsContent value="decode" className="space-y-4">
          <ToolPanel
            inputLabel="Enter Morse code"
            inputPlaceholder="Paste Morse code… e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -.."
            input={input}
            onInputChange={setInput}
            outputLabel="Decoded text"
            output={textOutput}
            breakdown={breakdown}
            wpm={wpm}
            onWpmChange={setWpm}
            playState={playState}
            onPlay={playMorse}
            onStop={stopAudio}
            onCopy={() => handleCopy(textOutput)}
            onReset={handleReset}
            hint={
              <p className="text-xs text-muted-foreground">
                Separate letters with spaces. Separate words with{" "}
                <code className="bg-muted px-1 rounded">/</code> or 3+ spaces.
              </p>
            }
          />
        </TabsContent>
      </Tabs>

      {/* Reference chart */}
      <details className="mt-8 rounded-xl border border-border/50 overflow-hidden">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-colors select-none">
          Morse Code Reference Chart
        </summary>
        <div className="px-4 pb-4 pt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {Object.entries(MORSE_MAP).map(([char, code]) => (
            <div
              key={char}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-2 py-1.5 text-xs font-mono"
            >
              <span className="font-bold text-brand">{char}</span>
              <span className="text-muted-foreground">{code}</span>
            </div>
          ))}
        </div>
      </details>
    </motion.div>
  );
}

interface ToolPanelProps {
  inputLabel: string;
  inputPlaceholder: string;
  input: string;
  onInputChange: (v: string) => void;
  outputLabel: string;
  output: string;
  breakdown: BreakdownItem[];
  wpm: number;
  onWpmChange: (v: number) => void;
  playState: PlayState;
  onPlay: () => void;
  onStop: () => void;
  onCopy: () => void;
  onReset: () => void;
  hint: React.ReactNode;
}

function ToolPanel({
  inputLabel,
  inputPlaceholder,
  input,
  onInputChange,
  outputLabel,
  output,
  breakdown,
  wpm,
  onWpmChange,
  playState,
  onPlay,
  onStop,
  onCopy,
  onReset,
  hint,
}: ToolPanelProps) {
  return (
    <>
      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {inputLabel}
        </label>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          rows={4}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base font-mono resize-none focus:outline-none focus:ring-2 focus:ring-brand/50 transition-colors placeholder:text-muted-foreground/50"
        />
        {hint}
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {outputLabel}
          </label>
          <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 font-mono text-base leading-relaxed min-h-[80px] break-all">
            {output}
          </div>
        </div>
      )}

      {/* Character breakdown */}
      {breakdown.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Character breakdown
          </label>
          <div className="flex flex-wrap gap-2">
            {breakdown.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg border border-border/60 bg-muted/40 px-2 py-1.5 min-w-[40px]"
              >
                <span className="text-xs font-semibold text-brand">
                  {item.top}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  {item.bottom}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {/* WPM Slider */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Speed: {wpm} WPM
          </span>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={wpm}
            onChange={(e) => onWpmChange(Number(e.target.value))}
            className="flex-1 accent-brand cursor-pointer"
            aria-label="Speed in words per minute"
          />
        </div>

        {/* Play / Stop */}
        {input &&
          (playState === "playing" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
              className="gap-1.5 border-destructive text-destructive hover:bg-destructive/10"
            >
              <Square className="h-3.5 w-3.5" />
              Stop
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onPlay}
              className="gap-1.5 border-brand text-brand hover:bg-brand/10"
            >
              <Play className="h-3.5 w-3.5" />
              Play Audio
            </Button>
          ))}

        {/* Copy */}
        {output && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        )}

        {/* Reset */}
        {input && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </>
  );
}
