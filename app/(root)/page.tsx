import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";

import { sampleBooks } from "@/constants";
import { db } from "@/database/db";
import { users } from "@/database/schema";


const Home = async () => {

  const data = await db.select().from(users);
  console.log(JSON.stringify(data, null, 2));


  return (
    <>
      <BookOverview {...sampleBooks[0]} />

      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassname="mt-28"
      />

    </>
  );
};

export default Home;
