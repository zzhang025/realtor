import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router";
import { doc, updateDoc } from "firebase/firestore";
import {Link} from "react-router-dom";
import { db } from "../Firebase";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setformData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onSignOut() {
    auth.signOut();
    navigate("/");
  }

  function onChange(event) {
    setformData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update the displayName in firebase authentication
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }

      toast.success(`Profile details updated!`);
    } catch (error) {
      toast.error("Couldn't update your profile detail.");
    }
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/* name input */}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border
           border-gray-300 rounded transition ease-in-out ${
             changeDetail && "bg-red-200 focus: bg-red-200"
           }`}
            ></input>

            {/* email input */}
            <input
              type="text"
              id="email"
              value={email}
              disabled={!changeDetail}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border
          border-gray-300 rounded transition ease-in-out"
            ></input>

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="flex items-center mb-6">
                Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-800 transition ease-in-out
              duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onSignOut}
                className="text-blue-600 hover:text-blue-800 transition ease-in-out
              duration-200 ml-1 cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button type="submit" className="w-full bg-blue-600 text-white uppercase px-5 py-3 text-sm font-medium rounded
          shadow-md hover:bg-blue-700 transition ease-in-out duration-200 hover:shadow-lg
          active:bg-blue-900">
            <Link className="flex justify-center items-center" to="/create-listing">
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2"/>
              Sell or rent your Home
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}
