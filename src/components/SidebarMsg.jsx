import React from "react";

const SidebarMsg = () => {
  return (
    <div className="home_bg flex">
      <div className="sidebar_bg w-1/6 h-screen">
        <h1 className="text-md text-goldenOrange flex justify-center items-center pt-4">
          Direct Messages
        </h1>
        <div className="flex pl-4 pt-2">
          <div className="w-12 h-12 rounded-full bg-primaryBlue border-[1px] border-goldenOrange"></div>
          <h1 className="flex items-center pl-4 text-md">Jimmy</h1>
        </div>
      </div>
      <div className="w-2/3 bg-purple-600 h-screen overflow-y-auto">
        <nav className="text-goldenOrange text-2xl border-b-2 border-b-primaryDark">
            <h1 className="p-2">CHANNEL NAME</h1>
        </nav>
      </div>
      <div className="bg-red-500 w-1/6">
        
      </div>
    </div>
  );
};

export default SidebarMsg;
