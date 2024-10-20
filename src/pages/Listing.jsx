import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { effectTarget } from "swiper/effect-utils";

export default function Listing() {
  const params = useParams();
  const [listing, setlisting] = useState(null);
  const [loading, setloading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setlisting(docSnap.data());
        setloading(false);
        console.log(listing);
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
                backgroundSize:"cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
