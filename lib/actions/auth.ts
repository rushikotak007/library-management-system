"use server";
import { signIn } from "@/authConfig";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { AuthCredentials } from "@/types";
import { hash } from "bcryptjs";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error signing in user" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, universityId, universityCard, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
     redirect("/too-fast");
  }

  const existingUser = db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if ((await existingUser).length > 0) {
    return { success: false, error: "User with this email already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      universityCard,
      password: hashedPassword,
    });

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: { email, fullName },
    });

    await signInWithCredentials({ email, password });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, error: error + "Error creating user" };
  }
};
