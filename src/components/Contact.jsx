import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Navigate, useParams } from "react-router";
import { db } from "../Firebase";
import { toast } from "react-toastify";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const params = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Landlord not found");
      }
    }
    getLandlord();
  }, [params.listingId]);

  function onChange(event) {
    setMessage(event.target.value);
  }

  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p className="">
            Contact {landlord.name} for the {listing.name}
          </p>
          <div>
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            ></textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button className="px-7 py-3 bg-blue-300 text-white rounded-md text-sm uppercase shadow-md hover:bg-blue-700
            hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800
            active:shadow-lg transition duration-150 w-full text-center" type="button">Send Message</button>
          </a>
        </div>
      )}
    </>
  );
}
