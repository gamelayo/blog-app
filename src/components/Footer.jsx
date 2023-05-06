import React from "react";
const date = new Date();
const year = date.getFullYear();
const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-1 w-full bg-cyan-100 py-4 rounded shadow-xl border">
      <div class="flex gap-2 mx-auto text-slate-700">
        <p>Coded by</p>
        <a
          href="https://twitter.com/GAMEL06"
          target="_blank"
          className="text-blue-400"
        >
          Gamel Ayodele
        </a>
      </div>

      <div class="flex gap-1 m-auto mx-auto text-slate-700">
        <p>Powered by</p>
        <a
          href="https://newbreedtraining.com/"
          target="_blank"
          className="text-blue-400"
        >
          NewBreedtraining Blog
        </a>
      </div>
      <div className="text-slate-700">&copy; {year} All Rights Reserved</div>
    </footer>
  );
};

export default Footer;
