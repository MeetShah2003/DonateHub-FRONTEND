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
          <Component {...pageProps} />
        </SessionProvider>
      </AuthProvider>
    </>
  );
}
