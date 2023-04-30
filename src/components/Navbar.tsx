import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex items-center">
          <h1 className="font-bold text-xl text-gray-600">News</h1>
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
          <Link
            to="/"
            className=" inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium border-indigo-500 text-gray-900"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
