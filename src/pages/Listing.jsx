import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../Firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  SwiperCore.use([Autoplay, Navigation, Pagination]);

useEffect(() => {
    async function fetchListing() {
        const docRef = doc(db, "listings", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setListing(docSnap.data());
            setLoading(false);
        }
    }
    fetchListing();
}, [params.listingId]);

  if (loading) {
    return <Spinner></Spinner>;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((URL, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `URL(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="fixed top-[11%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400
      rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500"></FaShare>
      </div>
      {shareLinkCopied && (
        <p
          className="fixed top-[17%] right-[5%] font-semibold border-2 border-gray-400
        rounded-md bg-white z-10"
        >
          Link copied!
        </p>
      )}

      <div
        className="flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 rounded-lg shadow-lg bg-white
      lg:space-x-5"
      >
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-800">
            {listing.name} - $
            {listing.offer && listing.discountedPrice !== undefined
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="flex items-center mt-3 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-600 mr-1"></FaMapMarkerAlt>{" "}
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p
              className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center
            font-semibold shadow-md"
            >
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p
                className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center
            font-semibold shadow-md"
              >
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">
              Description - {listing.description}
            </span>
          </p>
          <ul className="flex items-center space-x-2 lg:space-x-10 text-sm font-semibold mb-12">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="" />
              {+listing.bedroom > 1 ? `${listing.bedroom} Beds` : `1 Bed`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="" />
              {+listing.bathroom > 1 ? `${listing.bathroom} Baths` : `1 Bath`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="" />
              {+listing.parking ? "Parking" : `No Parking`}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="" />
              {+listing.furnished ? "Furnished" : `No Furnished`}
            </li>
          </ul>
          {listing.userRef === auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button onClick={() => {
                setContactLandlord(true);
              }}
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm
               uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
               focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing}></Contact>
          )}
        </div>
        <div className="bg-blue-300 w-full h-[200px] lg=[400px] z-10 overflow-x-hidden"></div>
      </div>
    </main>
  );
}
