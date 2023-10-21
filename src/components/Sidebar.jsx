import React from "react";
// import { BsPlus } from 'react-icons/bs';

const Sidebar = () => {
  return (
    <header>
      <div class="sidebar_bg fixed w-20 h-screen flex justify-center hover:shadow-inner">
        <div class="relative flex h-14 w-14 transform items-center justify-center rounded-full bg-blue-400 transition-transform hover:scale-110 mt-4">
          <div class="absolute left-20 rounded-lg bg-white p-2 text-lg shadow-md transition-opacity opacity-100 hover:block">
            Surprise!
          </div>
        </div>
      </div>

      {/* <SidebarIcon icon={<BsPlus size="32" />}/> */}
    </header>
  );
};

// const SidebarIcon = ({ icon }) => (
//   <div className="sidebar-icon group">
//     {icon}
//     <span class="group-hover:scale-100">
//       Hello
//     </span>
//   </div>
// )

export default Sidebar;
