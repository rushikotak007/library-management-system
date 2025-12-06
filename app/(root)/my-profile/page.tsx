import { signOut } from "@/authConfig";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";

const myProfilePage = () => {

  const serverLogout = async () => {
    'use server'
    await signOut();
  }

  return (
    <>
    <form action={serverLogout} className="flex justify-start mb-10">
      <Button className="text-black">Log Out</Button>
    </form>

    <BookList title="Borrowed books" books={sampleBooks}></BookList>
    </>
  )
}
    
export default myProfilePage;