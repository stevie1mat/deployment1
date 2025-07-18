import GitHub from 'next-auth/providers/github';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {

  providers: [
GitHub({
  clientId: process.env.AUTH_GITHUB_ID!,
  clientSecret: process.env.AUTH_GITHUB_SECRET!,
  authorization: {
    params: {
      scope: "read:user user:email", // 
    },
  },
}),

  ],
};
