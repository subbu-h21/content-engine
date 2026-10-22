/** Light (default) or dark colours for the website: <html data-theme>, remembered per browser. index.html sets it
 *  before the page draws, so there's no flash of the other theme. */
export type Theme = "light" | "dark";
const KEY = "ce.theme";

export function getTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    // storage unavailable: this page still switches
  }
}
