// import React from "react";
// import logo from "../Vista Logos/logo-png.png";
// import { useNavigate } from "react-router-dom";
// import FileUploadComponent from "./fileHandlers/FileUploader";
// import ProfilePicture from "./fileHandlers/profile";
// const Header: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div>
//       <header className="bg-gray-800 text-white py-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <img src={logo} alt="Logo" className="w-18 h-12 mr-2" />
//           </div>
//           <nav>
//             <ul className="flex space-x-4">
//               <li>
//                 <a href="#" className="hover:text-gray-300">
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-gray-300">
//                   About
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="hover:text-gray-300">
//                   Contact
//                 </a>
//               </li>

//               <li>
//                 <button onClick={handleLogout}>Logout</button>
//               </li>
//             </ul>
//           </nav>

//         </div>
//       </header>
//       <FileUploadComponent />
//     </div>
//   );
// };

// export default Header;
import React from "react";
import logo from "../Vista Logos/logo-png.png";
import { useNavigate } from "react-router-dom";
import FileUploadComponent from "./fileHandlers/FileUploader";
import ProfilePicture from "./fileHandlers/profile";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-18 h-12 mr-2" />
          </div>
          <nav>
            <ul className="flex space-x-4 items-center">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              <li>
                <ProfilePicture />
              </li>
              {/* <li>
                <button onClick={handleLogout} className="hover:text-gray-300">
                  Logout
                </button>
              </li> */}
            </ul>
          </nav>
        </div>
      </header>
      <FileUploadComponent />
    </div>
  );
};

export default Header;
