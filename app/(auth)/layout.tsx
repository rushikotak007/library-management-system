import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/authConfig";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-row gap-3"></div>
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={37}
            height={37}
          />
          <div className="">{children}</div>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/images/auth-illustration.png"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover|"
        />
      </section>
    </main>
  );
};

export default Layout;
