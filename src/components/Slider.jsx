import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../Firebase";
import { orderBy, collection, query, limit, getDocs } from "firebase/firestore";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      let listings = [];
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      console.log(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner></Spinner>;
  }
  if(listings.length === 0){
    return <></>
  }
  return listings && <>
    <Swiper 
      slidesPerView={1}
      navigation
      pagination={{type:"progressbar"}}
      effect="fade"
      modules={[EffectFade]}
      autoplay={{delay:3000}}
    >
      {
        listings.map((listing, id)=>(
          <SwiperSlide key={id} onClick={()=>(navigate(`/category/${listing.data.type}/${listing.id}`))}>
            <div style={{background:`url(${listing.data.imgUrls[0]}) center, no-repeat `, 
            backgroundSize:"cover"}}
            className='relative w-full h-[300px] overflow-hidden'>
            </div>
          <p className='text-[#f1faee] absolute left-1 top-3 font-medium
          max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl'>
            {listing.data.name}
          </p>
          <p className='text-[#f1faee] absolute left-1 bottom-1 font-semibold
          max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl'>
            ${listing.data.discountedPrice ?? listing.data.regularPrice}
            {listing.data.type === "rent" && " / month"}
          </p>
          </SwiperSlide>
        ))
      }
    </Swiper>
  </>
}
