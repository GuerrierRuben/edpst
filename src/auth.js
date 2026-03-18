import NextAuth from "next-auth"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    ...authConfig,
    providers: [
        Credentials({
            name: "Secret Credentials",
            credentials: {
                username: { label: "Nom utilisateur", type: "text" },
                password: { label: "Code Secret", type: "password" }
            },
            async authorize(credentials) {
                const adminUser = process.env.ADMIN_USERNAME;
                const adminPass = process.env.ADMIN_SECRET_CODE;

                if (
                    credentials?.username === adminUser &&
                    credentials?.password === adminPass
                ) {
                    return {
                        id: "1",
                        name: "Administrateur",
                        email: "admin@eglise.com",
                        role: "ADMIN",
                    };
                }

                return null;
            }
        })
    ],
})
