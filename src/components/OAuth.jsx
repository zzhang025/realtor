import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router";

export default function OAuth() {
    const navigate = useNavigate();
  async function onGoogleClick() {
    try {
        const auth = getAuth()
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth,provider);
        const user = result.user;

        // Check if user exist
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                name: user.displayName,
                email: user.email,
                timestamp: serverTimestamp(),
            })
        }

        navigate("/")
    } catch (error) {
      toast.error("Couldn't verify with google!");
    }
  }

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex justify-center items-center w-full bg-red-700 uppercase px-7 py-3 text-white text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg transition duration-200 ease-in-out rounded-md"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}
