import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import ToastMessage from "../components/ToastMessage";
import { AuthProvider } from "@/context/auth";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <AuthProvider>
        <ToastMessage />
        <SessionProvider session={session}>
          {/* <GoogleOAuthProvider clientId="609789324421-qica554rr8nhuq5lo9lv99jpvi6ti6g8.apps.googleusercontent.com"> */}
          <Component {...pageProps} />
          {/* </GoogleOAuthProvider> */}
        </SessionProvider>
      </AuthProvider>
    </>
  );
}
