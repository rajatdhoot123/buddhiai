import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Image from "next/image";
import { WHATSAPP_SUPPORT_NUMBER } from "@/constant";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
      <a
        target="_blank"
        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_SUPPORT_NUMBER}&text=hello`}
        className="h-12 w-12 fixed bottom-6 right-6 z-50"
      >
        <Image
          className="bg-white rounded-full"
          fill
          alt="Buddhi AI"
          src="/whatsapp.png"
        />
      </a>
    </SessionContextProvider>
  );
}

export default App;
