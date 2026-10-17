/** Two pages: "/" and "/p/<project>". Links use history.pushState so the page never reloads. */
export const navigate = (to: string) => {
  history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
