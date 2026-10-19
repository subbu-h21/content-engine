import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./Home";
import { Project } from "./Project";
import { PublishPage } from "./PublishPage";
import { Settings } from "./Settings";
import "./styles.css";

/** "/" home; "/settings"; "/publish" (history) and "/publish/<project>"; "/p/<project>" editor; "/p/<project>/brief" brief; "/p/<project>/final" final render. */
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
  const m = /^\/p\/([^/]+)(?:\/(brief|final))?/.exec(path);
  return m ? <Project name={decodeURIComponent(m[1])} tab={(m[2] as "brief" | "final" | undefined) ?? "editor"} /> : <Home />;
};

createRoot(document.getElementById("root")!).render(<App />);
