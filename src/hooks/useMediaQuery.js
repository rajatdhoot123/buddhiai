import { useState, useEffect } from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    let listener;
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      listener = () => setMatches(media.matches);
      window.addEventListener("resize", listener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", listener);
      }
    };
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;
