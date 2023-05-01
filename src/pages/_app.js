import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Image from "next/image";
import { WHATSAPP_SUPPORT_NUMBER } from "@/constant";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/logo.png" />

        <title>
          Document to Chatbot Converter: Convert Any Text into Engaging Chatbots
        </title>
        <meta
          name="description"
          content="Use our advanced natural language processing technology to quickly convert any text into engaging chatbots for your messaging platform or website."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="chatbot converter, natural language processing, document conversion, messaging platform, website chatbots"
        />
        <meta name="author" content="Kwiktwik" />
        <meta name="theme-color" content="#0D0C16" />
        <link rel="icon" href="/logo.png" type="image/x-icon" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://buddhiai.app" />
        <meta
          property="og:title"
          content="Document to Chatbot Converter: Convert Any Text into Engaging Chatbots"
        />
        <meta
          property="og:description"
          content="Use our advanced natural language processing technology to quickly convert any text into engaging chatbots for your messaging platform or website."
        />
        <meta property="og:image" content="[insert image URL here]" />
        <meta property="og:url" content="https://buddhiai.app" />
        <meta
          name="twitter:title"
          content="Document to Chatbot Converter: Convert Any Text into Engaging Chatbots"
        />
        <meta
          name="twitter:description"
          content="Use our advanced natural language processing technology to quickly convert any text into engaging chatbots for your messaging platform or website."
        />
        <meta name="twitter:image" content="[insert image URL here]" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
    </>
  );
}

export default App;
