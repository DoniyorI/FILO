import React from "react";

const Sidebar = () => {
  return (
    <aside className="sidebar_bg h-screen w-20 fixed z-10">
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 bg-[#225374] rounded-full mt-6 mb-5"></div>
        <div className="h-14 w-14 bg-[#225374] rounded-full mb-5"></div>
      </div>
    </aside>
  );
};


export default Sidebar;
