import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: "7cf82672c272cdaffae4",
      clientSecret: "9d2bc3245feeb9c1c95f64899c7c309d87054b47",
    }),
  ],
};
export default NextAuth(authOptions);
