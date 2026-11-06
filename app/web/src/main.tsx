import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CatalogGallery, DraftPage, NewStyle, StylePage } from "./Catalog";
import { Home } from "./Home";
import { Project } from "./Project";
import { PublishPage } from "./PublishPage";
import { Settings } from "./Settings";
import "./styles.css";

/** "/" home; "/settings"; "/publish" (history) and "/publish/<project>"; "/p/<project>" editor; "/p/<project>/brief" brief; "/p/<project>/final" final render;
 *  "/catalog" styles, "/catalog/<style>" one style, "/catalog/new" → "/catalog/new/<draft>" a new style. */
const App: React.FC = () => {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const on = () => setPath(location.pathname);
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  // older links: the Published page and a video's Publish tab are now the Publish page
  const old = /^\/p\/([^/]+)\/publish/.exec(path) ?? (path === "/published" ? ["", ""] : null);
  useEffect(() => {
    if (old) history.replaceState(null, "", old[1] ? `/publish/${old[1]}` : "/publish");
  }, [path]);
  if (old) return <PublishPage name={old[1] ? decodeURIComponent(old[1]) : null} />;
  const pub = /^\/publish(?:\/([^/]+))?\/?$/.exec(path);
  if (pub) return <PublishPage name={pub[1] ? decodeURIComponent(pub[1]) : null} />;
  if (path === "/settings") return <Settings />;
  if (/^\/catalog\/?$/.test(path)) return <CatalogGallery />;
  if (/^\/catalog\/new\/?$/.test(path)) return <NewStyle />;
  const draft = /^\/catalog\/new\/(draft-\d{8}-\d{6})\/?$/.exec(path);
  if (draft) return <DraftPage draft={draft[1]} />;
  const style = /^\/catalog\/([a-z0-9-]+)\/?$/.exec(path);
  if (style) return <StylePage key={style[1]} id={style[1]} />;
  const m = /^\/p\/([^/]+)(?:\/(brief|final|review|package))?/.exec(path);
  return m ? <Project name={decodeURIComponent(m[1])} tab={(m[2] as "brief" | "final" | "review" | "package" | undefined) ?? "editor"} /> : <Home />;
};

createRoot(document.getElementById("root")!).render(<App />);
