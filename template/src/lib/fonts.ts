/**
 * Type: Bodoni MT + Inter from the Windows install when present (pixel-identical to the Python reel),
 * Bodoni Moda + Inter from Google Fonts otherwise. Both are awaited before any frame is captured.
 */
import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { loadFont as loadBodoniModa } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

loadBodoniModa("normal", { weights: ["400"], subsets: ["latin"] });
loadBodoniModa("italic", { weights: ["400"], subsets: ["latin"] });
loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

const LOCAL_FACES = [
  `400 100px "Bodoni MT"`,
  `italic 400 100px "Bodoni MT"`,
  `400 30px "Inter 18pt"`,
  `500 30px "Inter 18pt"`,
];

export const useFonts = (): void => {
  const [handle] = useState(() => delayRender("Waiting for fonts"));
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(handle);
      }
    };
    Promise.all(LOCAL_FACES.map((f) => document.fonts.load(f).catch(() => undefined)))
      .then(() => document.fonts.ready)
      .then(finish, finish);
    const t = setTimeout(finish, 4000);
    return () => clearTimeout(t);
  }, [handle]);
};
