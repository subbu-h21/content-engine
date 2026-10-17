import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Editor } from "./Editor";
import { Home } from "./Home";
import "./styles.css";


const App: React.FC = () => {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    const on = () => setPath(location.pathname);
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const m = /^\/p\/([^/]+)/.exec(path);
  return m ? <Editor name={decodeURIComponent(m[1])} /> : <Home />;
};

createRoot(document.getElementById("root")!).render(<App />);
