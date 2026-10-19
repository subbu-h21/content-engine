import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./Home";
import { Project } from "./Project";
import "./styles.css";

/** "/" home; "/p/<project>" editor; "/p/<project>/brief" brief; "/p/<project>/final" final render. */
const App: React.FC = () => {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const on = () => setPath(location.pathname);
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const m = /^\/p\/([^/]+)(?:\/(brief|final))?/.exec(path);
  return m ? <Project name={decodeURIComponent(m[1])} tab={(m[2] as "brief" | "final" | undefined) ?? "editor"} /> : <Home />;
};

createRoot(document.getElementById("root")!).render(<App />);
