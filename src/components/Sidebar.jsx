import React from "react";

const Sidebar = () => {
  return (
    <header>
      <nav className="sidebar_bg h-screen w-20 absolute">
      <div class="flex flex-col items-center">
          <div class="h-14 w-14 bg-[#225374] rounded-full mt-6 mb-5"></div>
          <div class="h-14 w-14 bg-[#225374] rounded-full mb-5"></div>
        </div>
      </nav>
    </header>
  );
};

export default Sidebar;
