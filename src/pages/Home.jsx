import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { db } from "../Firebase";
import {
  orderBy,
  collection,
  query,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Listing from "./Listing";
import ListingItem from "../components/ListingItem";

export default function Home() {
  // offer
  const [offerListing, setOfferListing] = useState(null);
  const [rentListing, setRentListing] = useState(null);
  const [saleListing, setSaleListing] = useState(null);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const offerListingsRef = collection(db, "listings");
        const q = query(
          offerListingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const listings = [];
        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferListing(listings);
        console.log(listings);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOfferListings();
  }, []);


  // rent
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const offerListingsRef = collection(db, "listings");
        const q = query(
          offerListingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const listings = [];
        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListing(listings);
        console.log(listings);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRentListings();
  }, []);
  // sale

  useEffect(() => {
    const fetchSaleListings = async () => {
      try {
        const offerListingsRef = collection(db, "listings");
        const q = query(
          offerListingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const listings = [];
        querySnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListing(listings);
        console.log(listings);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSaleListings();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 spac-y-6">
        {offerListing && offerListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p
                className="px-3 text-sm text-blue-600 hover:text-blue-800 transition-150 
              ease-in-out"
              >
                Show more offers.
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                ></ListingItem>
              ))}
            </ul>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places to Rent</h2>
            <Link to="/category/rent">
              <p
                className="px-3 text-sm text-blue-600 hover:text-blue-800 transition-150 
              ease-in-out"
              >
                Show more rentings.
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                ></ListingItem>
              ))}
            </ul>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places to Sale</h2>
            <Link to="/category/sale">
              <p
                className="px-3 text-sm text-blue-600 hover:text-blue-800 transition-150 
              ease-in-out"
              >
                Show more sales.
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleListing.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                ></ListingItem>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
