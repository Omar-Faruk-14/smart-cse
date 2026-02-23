import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

     async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Missing email or password");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Login API Error:", errorData);
      return null; 
    }

    const data = await res.json();


    if (data && data.user) {
      return {
        id: data.user._id || data.user.id, 
        email: data.user.email,
        role: data.user.role || "student",
        accessToken: data.token,
        name: data.user.name || "User",
      };
    }
    return null;
  } catch (error: any) {
    console.error("Auth Fetch Error:", error);
    return null;
  }
}
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.id = (user as any).id;
        console.log(token.role)
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
});

export { handler as GET, handler as POST };
