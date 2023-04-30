import { Outlet } from "react-router-dom";

import { Navbar } from "./components";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
};

export default App;
