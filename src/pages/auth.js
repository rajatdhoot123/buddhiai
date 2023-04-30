import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white w-full md:w-1/2 p-5 rounded-md">
          <Auth
            redirectTo="http://localhost:3000/"
            appearance={{ theme: ThemeSupa }}
            supabaseClient={supabaseClient}
            providers={[]}
            socialLayout="horizontal"
          />
        </div>
      </div>
    );

  return null;
};

export default LoginPage;
