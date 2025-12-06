import BookCard from "./BookCard";
import { Book } from "@/types";

interface Props {
  title: string;
  books: Book[];
  containerClassname?: string;
}

const BookList = ({ title, books, containerClassname="" }: Props) => {
  return (
    <section className={`${containerClassname}`}>
      <h2 className="font-bebas-neue font-bold text-4xl text-light-100">
        {title}
      </h2>

      <ul className="book-list">
        {books.map((book) => (
            <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookList;
