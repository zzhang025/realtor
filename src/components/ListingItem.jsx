import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li
      className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow
    durant-150"
    >
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-110 transition duration-200 ease-in"
          src={listing.imgUrls[0]}
          loading="lazy"
        ></img>
        <Moment
          className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold
        rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-cent space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600"></MdLocationOn>
            <p className="font-semibold text-sm mb-[2px] text-gray-600 trancate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl  truncate">{listing.name}</p>
          <p className="text-[#457b9d] font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedroom > 1 ? `${listing.bedroom} Beds` : "1 Bed"}{" "}
              </p>
            </div>
            <div>
              <p className="font-bold text-xs">
                {listing.bathroom > 1
                  ? `${listing.bathroom} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14-px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        ></FaTrash>
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-8 h-[14-px] cursor-pointer text-slate-500"
          onClick={() => onEdit(listing.id)}
        ></MdEdit>
      )}
    </li>
  );
}
