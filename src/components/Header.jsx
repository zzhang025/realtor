import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if (user) {
        setPageState(`Profile`)
      }else{
        setPageState(`Sign in`)
      }
    })
  }, [auth])
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  const [pageState, setPageState] = useState("Sign in")
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src="https://www.realtor.ca/images/logo.svg"
            alt="logo"
            className="h-9 cursor-pointer rounded-md"
            onClick={()=>navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 board-b-[3px] border-b-transparent ${
                pathMatchRoute("/") && "text-black border-b-red-500"
              }`}
              onClick={()=>navigate("/home")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 board-b-[3px] border-b-transparent ${
                pathMatchRoute("/offers") && "text-black border-b-red-500"
              }`}
              onClick={()=>navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 board-b-[3px] border-b-transparent ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))  && "text-black border-b-red-500"
              }`}
              onClick={()=>navigate("/profile")}
            >
             {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
