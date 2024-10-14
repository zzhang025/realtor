import { useState } from "react";

export default function CreateListing() {
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
    discountPrice: 0,
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
    discountPrice,
  } = formData;

  function onChange() {
    return;
  }

  return (
    <main className="max-w-md px-3 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form>
        <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value={"Sale"}
            onclick={onChange}
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
            value={"Sale"}
            onclick={onChange}
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
              id="bedroom"
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
            onclick={onChange}
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
            onclick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg 
                focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  parking ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}
          >
            No
          </button>
        </div>{" "}
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onclick={onChange}
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
            onclick={onChange}
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
        />{" "}
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
            onclick={onChange}
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
            onclick={onChange}
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
                  value={discountPrice}
                  onChange={onChange}
                  min={50}
                  max={999999999}
                  required={offer}
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
