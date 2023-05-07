import "../styles/globals.css";
import { Inter } from "next/font/google";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { WHATSAPP_SUPPORT_NUMBER } from "../constant";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import AppLayout from "../layout/app";
import { AppProvider } from "../context/AppContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  const router = useRouter();
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session) {
        axios.interceptors.request.use((config) => {
          config.headers["Authorization"] = `Bearer ${session.access_token}`;
          return config;
        });
        axios.interceptors.response.use(
          (response) => response,
          (error) => {
            const status = error.response ? error.response.status : null;

            if (status === 401) {
              // will loop if refreshToken returns 401
              if (typeof window !== "undefined") {
                window?.location?.reload();
              }
            }
            return Promise.reject(error);
          }
        );
      }
    });
  }, [supabaseClient.auth]);

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
        <meta property="og:image" content="/og_image.webp" />
        <meta property="og:url" content="https://buddhiai.app" />
        <meta
          name="twitter:title"
          content="Document to Chatbot Converter: Convert Any Text into Engaging Chatbots"
        />
        <meta
          name="twitter:description"
          content="Use our advanced natural language processing technology to quickly convert any text into engaging chatbots for your messaging platform or website."
        />
        <meta name="twitter:image" content="/og_image.webp" />
        <meta name="twitter:card" content="/og_image.webp" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <main className={inter.className}>
          {router.pathname.startsWith("/app") ? (
            <>
              <AppProvider>
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              </AppProvider>
            </>
          ) : (
            <>
              {!router.pathname.startsWith("/embed") && (
                <Script
                  buddhi_api_id="eyJmaWxlbmFtZSI6Im15anNvbmZpbGUudHh0IiwidXNlcklkIjoiYzgwM2M4OTctYzlkNy00NjNkLTkzZWYtNTZmNTI1ZjNlZTljIn0="
                  src="/buddi_widget/min-buddhi.js"
                  async
                />
              )}
              <Component {...pageProps} />
            </>
          )}
        </main>
      </SessionContextProvider>
      <Toaster />
    </>
  );
}

export default App;
