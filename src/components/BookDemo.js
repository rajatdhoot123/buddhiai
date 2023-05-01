import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Calander() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#eaade1" } },
        hideEventTypeDetails: false,
      });
    })();
  }, []);
  return (
    <button
      data-cal-link="kwiktwik/30min"
      className="px-5 py-2 rounded-md bg-[#293FCC] text-white"
    >
      Book Demo
    </button>
  );
}
