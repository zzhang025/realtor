import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import {
  orderBy,
  collection,
  query,
  limit,
  getDocs,
  where,
  startAfter
} from "firebase/firestore";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
export default function Offers() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetch(lastVisible);
        const listings = [];
        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListing(listings);
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  async function fetchMore() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetch),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetch(lastVisible);
      const listings = [];
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListing((prevState)=>[...prevState, ...listings]);
    } catch (error) {
      toast.error(error.message)
  }
}


  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-4">Offers</h1>
      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul
              className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
             2xl:grid-cols-5"
            >
              {listing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          {lastFetch && (
            <div className="mt-5 flex justify-center items-center">
              <button onClick={fetchMore}
                className="bg-white mb-3 px-3 py-1.5 text-gray-700 border
             border-gray-300 hover:border-slate-500 rounded-xl transition duration-150
              ease-in-out"
              >
                Lord More...
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There is no current offer.</p>
      )}
    </div>
  );
}
