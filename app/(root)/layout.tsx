import { auth } from "@/authConfig";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="root-container ">
      <div className="max-w-7xl mx-auto">
        <Header session={session} />
        <div className="mt-20 pb-20">{children} </div>
      </div>
    </main>
  );
};

export default RootLayout;
