import React, { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from "../Firebase";
import {doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const [formData, setformData] = useState({
    name:"",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const {name, email, password } = formData;
  const navigate = useNavigate();
  function onClick(e) {
    setformData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e){
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName: name
      });
      const user = userCredential.user;
      const formDataCopy = {...formData};

      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy)
      navigate("/");
    } catch (error) { toast.error("Something went wrong with the registration")  }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-start px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            src="https://images.unsplash.com/photo-1632849369576-06cb097fe68f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGtleXxlbnwwfHwwfHx8MA%3D%3D"
            alt="key"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
          <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white board-gray-300 rounded-md transition ease-in-out mb-6"
              type="text"
              id="name"
              value={name}
              placeholder="Full name"
              onChange={onClick}
            />
            <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white board-gray-300 rounded-md transition ease-in-out mb-6"
              type="email"
              id="email"
              value={email}
              placeholder="E-mail address"
              onChange={onClick}
            />
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                placeholder="Password"
                onChange={onClick}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white board-gray-300 rounded-md transition ease-in-out"
              />
              {showPassword ? (
                <IoIosEyeOff
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <IoIosEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                >
                  Sign In
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 px-7 text-sm font-medium uppercase rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-xl active:bg-blue-800"
              type="submit"
            >
              Sign Up
            </button>
            <div className="flex my-4 items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-center mx-4 font-semibold">OR</p>
            </div>
            <OAuth/>
          </form>
        </div>
      </div>
    </section>
  );
}
