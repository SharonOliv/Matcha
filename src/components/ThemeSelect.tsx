import type { Theme } from "../types";
import { THEME_LABELS, THEME_PREVIEWS, FALLBACK_ICON } from "../theme";

interface ThemeSelectProps {
  onSelect: (theme: Theme) => void;
}

export default function ThemeSelect({ onSelect }: ThemeSelectProps) {
  const themes = Object.keys(THEME_LABELS) as Theme[];

  return (
    <div className="screen">
      <h1 className="title-hero">Matcha</h1>
      <p className="tagline">Pick a deck and let's play!</p>
      <div className="theme-grid">
        {themes.map((theme) => (
          <button
            key={theme}
            type="button"
            className="theme-btn"
            data-theme={theme}
            onClick={() => onSelect(theme)}
          >
            <img
              src={THEME_PREVIEWS[theme]}
              alt=""
              className="theme-preview-img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_ICON;
              }}
            />
            <span>{THEME_LABELS[theme]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}