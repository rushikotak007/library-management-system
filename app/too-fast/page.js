import React from "react";

const tooFastPage = () => {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-5xl font-bold text-light">whoa, slow down there speedy</h1>
      Too many requests. Please try again later shortly.
    </main>
  );
};

export default tooFastPage;
