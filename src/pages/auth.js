import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layout/public";

const LoginPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log({ user });
      router.push("/app");
    }
  }, [supabaseClient, user]);

  if (!user)
    return (
      <Layout>
        <div className="bg-white w-full md:w-1/2 p-5 rounded-md my-24 m-auto">
          <Auth
            redirectTo="http://localhost:3000/"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={[]}
            socialLayout="horizontal"
          />
        </div>
      </Layout>
    );

  return null;
};

export default LoginPage;
