import type { Theme } from "./types";

export interface ThemeIcon {
  id: string;
  imageUrl: string;
  alt: string;
}

function twemoji(codepoint: string): string {
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codepoint}.png`;
}

function pokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

const POKEMON_IDS = [
  1, 4, 7, 25, 39, 52, 54, 58, 60, 63, 66, 74, 77, 79, 81, 94,
  95, 113, 123, 127, 130, 131, 133, 134, 135, 136, 143, 144, 145, 146, 150, 151,
];

const POKEMON: ThemeIcon[] = POKEMON_IDS.map((id) => ({
  id: `pokemon-${id}`,
  imageUrl: pokemonSprite(id),
  alt: `Pokémon #${id}`,
}));

async function fetchJuices(): Promise<ThemeIcon[]> {
  const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic");
  if (!res.ok) throw new Error("Failed to load juices");
  const data: { drinks: { idDrink: string; strDrink: string; strDrinkThumb: string }[] } =
    await res.json();

  return data.drinks.map((drink) => ({
    id: `juice-${drink.idDrink}`,
    imageUrl: drink.strDrinkThumb,
    alt: drink.strDrink,
  }));
}

async function fetchMeals(): Promise<ThemeIcon[]> {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert");
  if (!res.ok) throw new Error("Failed to load meals");
  const data: { meals: { idMeal: string; strMeal: string; strMealThumb: string }[] } =
    await res.json();

  return data.meals.map((meal) => ({
    id: `meal-${meal.idMeal}`,
    imageUrl: meal.strMealThumb,
    alt: meal.strMeal,
  }));
}

const cache = new Map<Theme, ThemeIcon[]>();

export async function getThemeIcons(theme: Theme): Promise<ThemeIcon[]> {
  const cached = cache.get(theme);
  if (cached) return cached;

  let icons: ThemeIcon[];
  switch (theme) {
    case "pokemon":
      icons = POKEMON;
      break;
    case "juices":
      icons = await fetchJuices();
      break;
    case "food":
      icons = await fetchMeals();
      break;
  }

  cache.set(theme, icons);
  return icons;
}

export const THEME_PREVIEWS: Record<Theme, string> = {
  pokemon: pokemonSprite(25),
  juices: twemoji("1f9c3"), // juice box
  food: twemoji("1f370"),
};

export const THEME_LABELS: Record<Theme, string> = {
  pokemon: "Pokémon",
  juices: "Juices",
  food: "World Food",
};

export const FALLBACK_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%23ccc'/%3E%3Ctext x='12' y='17' font-size='10' text-anchor='middle' fill='%23333'%3E%3F%3C/text%3E%3C/svg%3E";