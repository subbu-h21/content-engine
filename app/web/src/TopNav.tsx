/** The menu at the top of the Videos, Publish and Settings pages (compact: a thin bar, for the full-width Publish page). */
import React from "react";
import { navigate } from "./nav";

const ITEMS = [
  ["videos", "/", "Videos"],
  ["publish", "/publish", "Publish"],
  ["settings", "/settings", "Settings"],
] as const;

export const TopNav: React.FC<{ current: "videos" | "publish" | "settings"; compact?: boolean }> = ({ current, compact }) => (
  <header className={compact ? "bar topbar" : "home-head"}>
    {compact ? (
      <a
        className="brand"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        Content <em>engine</em>
      </a>
    ) : (
      <h1>
        Content <em>engine</em>
      </h1>
    )}
    <nav className="topnav">
      {ITEMS.map(([id, href, label]) => (
        <a
          key={id}
          href={href}
          className={current === id ? "on" : ""}
          onClick={(e) => {
            e.preventDefault();
            navigate(href);
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  </header>
);
