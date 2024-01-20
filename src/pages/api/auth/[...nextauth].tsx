import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: "7cf82672c272cdaffae4" || "",
      clientSecret: "f8c7b5fe7922600dab842e52d3ad5b8434452127" || "",
    }),
  ],
};
export default NextAuth(authOptions);
