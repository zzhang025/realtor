import { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router";

export default function CreateListing() {
  const navigate = useNavigate();
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const auth = getAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setformData] = useState({
    type: "rent",
    name: "",
    bedroom: 1,
    bathroom: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });

  const {
    type,
    name,
    bedroom,
    bathroom,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setformData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/boolean/Number
    if (!e.target.files) {
      setformData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted Price needs to be lower than regular price.");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("Cannot upload more than 6 images.");
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.latitude = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.longitude = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("please enter correct address.");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded.");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-3 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value={"sale"}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  type === "rent"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  type === "sale"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
          >
            rent
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength={30}
          minLength={10}
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded 
          transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="flex space-x-6">
          <div className="">
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedroom"
              value={bedroom}
              onChange={onChange}
              min="1"
              man="50"
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded
              transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6
              text-center"
            ></input>
          </div>
          <div className="">
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathroom"
              value={bathroom}
              onChange={onChange}
              min="1"
              man="50"
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded
              transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6
              text-center"
            ></input>
          </div>
        </div>
        <p className="text-lg font-semibold">Parking spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            No
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded 
          transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded
              transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6
              text-center"
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
              ></input>
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded
              transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6
              text-center"
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
              ></input>
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded 
          transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  offer ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            No
          </button>
        </div>
        <div className="flex items-center mt-6 mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular Price</p>
            <div className="flex w-full justifiy-center items-center space-x-6">
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border
                 border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
                  focus:bg-white focus:border-slate-600 text-center"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min={50}
                max={999999999}
                required
              ></input>
              {type === "rent" && (
                <div className="">
                  <p className="text-md w-full whitespace-nowrap">
                    $ per Month
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer === true && (
          <div className="flex items-center mt-6 mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted Price</p>
              <div className="flex w-full justifiy-center items-center space-x-6">
                <input
                  className="w-full px-4 py-2 text-lg text-gray-700 bg-white border
               border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700
                focus:bg-white focus:border-slate-600 text-center"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min={50}
                  max={999999999}
                  required={offer}
                ></input>
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded
             transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          ></input>
        </div>
        <button
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm 
        uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800
        focus:shadow-lg active:bg-blue-800 active:shawdow-lg transition duration-150 ease-in-out "
          type="submit"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}
