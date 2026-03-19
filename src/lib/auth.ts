import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [process.env.APP_URL!],

     user: {
        additionalFields: {
            role: {
                type: "string", 
                defaultValue: "CUSTOMER", 
                required: true
            },
            phone:{
                type: "string",
                returned: true
            }
        },
    },

    emailAndPassword: {
        enabled : true,
        autoSignIn: false,
        requireEmailVerification: true
    },


    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
       sendVerificationEmail: async({user, url, token}, request) =>{
        try {

         const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`

         const info = await transporter.sendMail({
          from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
          to: "lovercoc675@gmail.com",
          subject: "Verify your email",
          text: "Verify email fast!", // Plain-text version of the message
          html: `
          <h1>Hello, ${user.name}</h1>
          <p>verify your email</p>
          <a href=${verificationUrl}>verify</a>`,
      });
         console.log(info.messageId)
        } catch (error) {
            console.error(error);
            throw error;
        }
       }
    },

    socialProviders:{
        google: {
            prompt: "select_account consent",
            accessType : "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }
    }

});