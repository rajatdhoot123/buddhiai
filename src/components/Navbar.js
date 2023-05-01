import React, { useState } from "react";
import Image from "next/image";
import { NAV_LIST } from "../constant";
import Link from "next/link";
import { useRouter } from "next/router";
import BookDemo from "./BookDemo";

const Logo = ({ className = "" }) => (
  <Link
    href="/"
    className="flex items-center hover:scale-125 transition duration-150 ease-in"
  >
    <div className="flex-shrink-0">
      <Image
        alt="Buddhi AI"
        className="h-12 w-12"
        height="28"
        width="28"
        src="/logo.png"
      />
    </div>
    <span className={`font-semibold text-xl ml-2 ${className}`}>Buddhi AI</span>
  </Link>
);

const NavList = ({ setIsOpen }) => {
  return (
    <div
      onClick={() => setIsOpen(false)}
      className="md:space-x-8 space-y-8 md:space-y-0 flex-col md:flex-row flex md:ml-48"
    >
      {NAV_LIST.map(({ label, link }) => (
        <Link
          key={label}
          href={link}
          className={`font-semibold hover:scale-125 hover:font-bold transition duration-150 ease-in`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  return (
    <>
      <nav className="container flex md:hidden mx-auto items-center justify-between p-5">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex lg:hidden mr-5 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Logo className="text-white" />
        </div>
        <BookDemo />
      </nav>
      <nav className="hidden md:flex items-center text-white justify-around">
        <Logo className="text-white" />
        {router.pathname !== "/auth" && (
          <NavList className="text-white" setIsOpen={setIsOpen} />
        )}
        <BookDemo />
      </nav>
      <div
        className={`z-20 md:hidden fixed inset-0 bg-white h-screen w-full md:w-96 transform transition-all ease-in-out duration-500 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="w-full justify-between flex items-center p-5">
            <Logo className="text-black" />
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <strong className="text-[28px] align-center cursor-pointer alert-del">
                &times;
              </strong>
            </button>
          </div>
          <div className="p-5">
            <NavList className="text-black" setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
