import HamburgerIcon from "@/icons/HamburgurIcon";
import Link from "next/link";

const Visitor = () => {
  const NAV_MENUES: { id: number; menu: string; path: string }[] = [
    {
      id: 1,
      menu: "Home",
      path: "/",
    },
    {
      id: 2,
      menu: "Contact Us",
      path: "/contactus",
    },
    {
      id: 2,
      menu: "About Us",
      path: "/aboutus",
    },
  ];

  return (
    <div>
      <div className="bg-white border shadow-sm">
        <nav className="max-w-full w-90% py-4 mx-auto flex items-center justify-between">
          <div className="sm:hidden">
            <HamburgerIcon />
          </div>

          <div className="logo text-black font-bold text-3xl">DH</div>
          <div className="hidden sm:flex">
            <ul className="gap-5 lg:gap-7 sm:flex">
              {NAV_MENUES.map(({ id, menu, path }) => {
                return (
                  <li key={id} className="text-lg">
                    <Link href={path}>{menu}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="hidden sm:flex gap-5">
            <button>Sign in</button>
            <button className="bg-primary text-white py-3 px-5 font-semibold">
              Sign up
            </button>
          </div>
        </nav>
      </div>
      {/* <div className="relative  w-full">
        <div className="absolute bg-black h-screen w-1/2">d</div>
      </div> */}
    </div>
  );
};

export default Visitor;
