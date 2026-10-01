import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { StudyServices as Services } from "../application/study-services";
import type { Locale, TranslationCatalog } from "../shared/kernel/types";
import type { Progress } from "../modules/learning-progress/public";
const Context = createContext<null | {
  services: Services;
  locale: Locale;
  setLocale: (l: Locale) => void;
  progress: Progress;
  updateProgress: (p: Progress) => void;
  message: string;
  setMessage: (s: string) => void;
}>(null);
export function StudyProvider({
  services,
  children,
}: {
  services: Services;
  children: ReactNode;
}) {
  const [locale, setLanguage] = useState<Locale>(() =>
    services.localization.current(),
  );
  const [progress, setProgress] = useState(() => services.progress.load());
  const [message, setMessage] = useState("");
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);
  const setLocale = (l: Locale) => {
    setLanguage(l);
    services.localization.select(l);
  };
  const updateProgress = (p: Progress) => {
    setProgress(p);
    if (!services.progress.save(p)) setMessage("ui.storageError");
  };
  return (
    <Context.Provider
      value={{
        services,
        locale,
        setLocale,
        progress,
        updateProgress,
        message,
        setMessage,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStudy() {
  const value = useContext(Context);
  if (!value) throw Error("Missing study provider");
  return value;
}
export function useUi() {
  const { services, locale } = useStudy();
  return (id: string, params: Record<string, string | number> = {}) => {
    let text = services.localization.ui(id, locale);
    for (const [key, value] of Object.entries(params))
      text = text.replaceAll("{" + key + "}", String(value));
    return text;
  };
}
export function Text({
  id,
  catalog,
}: {
  id: string;
  catalog: TranslationCatalog;
}) {
  const { services, locale } = useStudy();
  return (
    <span lang={locale === "zh" ? "zh-CN" : "en"} data-content-id={id}>
      {services.localization.text(catalog, id, locale)}
    </span>
  );
}
