import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALE_ALIASES, isLocale } from "./registry";
import type { Locale } from "./registry";
import { makeT } from "./translate";
import type { TFunc } from "./translate";
import { setDisplayLocale } from "../lib/datetime";

const LANG_KEY = "samkoma-lang";

interface LangContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFunc;
}

const LangContext = createContext<LangContextValue | null>(null);

// Saved choice wins; otherwise match the browser's language against the
// registry (exact base code, then an alias like nn/no → nb); otherwise default.
function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && isLocale(saved)) return saved;
  } catch {
    // storage unavailable — fall through to browser detection
  }
  const nav =
    typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
  const base = nav.split("-")[0];
  if (isLocale(base)) return base;
  if (base in LOCALE_ALIASES) return LOCALE_ALIASES[base];
  return DEFAULT_LOCALE;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  // Keep date/time formatting in sync with the UI language. Set during render
  // (LangProvider renders before its children) so date labels and the chosen
  // language never disagree, even on the first paint after a switch.
  setDisplayLocale(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(LANG_KEY, locale);
    } catch {
      // storage unavailable (private mode / disabled) — degrades gracefully
    }
  }, [locale]);

  const t = useMemo(() => makeT(locale), [locale]);
  const value = useMemo<LangContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// Outside a provider, resolve against the default locale instead of throwing,
// so a component can render in isolation (e.g. unit tests) without ceremony.
function useLangContext(): LangContextValue {
  const ctx = useContext(LangContext);
  const fallback = useMemo<LangContextValue>(
    () => ({
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: makeT(DEFAULT_LOCALE),
    }),
    [],
  );
  return ctx ?? fallback;
}

export function useLang(): LangContextValue {
  return useLangContext();
}

export function useT(): TFunc {
  return useLangContext().t;
}

export function useLocale(): [Locale, (locale: Locale) => void] {
  const { locale, setLocale } = useLangContext();
  return [locale, setLocale];
}
