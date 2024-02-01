import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: "7cf82672c272cdaffae4",
      clientSecret: "9d2bc3245feeb9c1c95f64899c7c309d87054b47",
    }),
    GoogleProvider({
      clientId:
        "609789324421-qica554rr8nhuq5lo9lv99jpvi6ti6g8.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
};
export default NextAuth(authOptions);
