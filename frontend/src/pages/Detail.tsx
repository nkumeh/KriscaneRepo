import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import React, { useState } from 'react';

const Detail = () => {
  const { hotelId } = useParams();

  // declare room types states 
  const [roomPreference, setRoomPreference] = useState("");

  // declare breakfast choice states
  const [breakfastChoices, setBreakfastChoices] = useState({
    intercontinental: false,
    allYouCanEat: false,
    aLaCarte: false
  });

  const { data: hotel } = useQuery(
    "fetchHotelById", () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotel) {
    return <></>;
  }

  const handleRoomChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setRoomPreference(event.target.value);
  };

  const handleBreakfastChoices = (event: { target: { value: any; checked: any; }; }) => {
    const { value, checked } = event.target;
    setBreakfastChoices(prev => ({
      ...prev,
      [value]: checked
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.branchName}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={hotel.branchName}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      {/* Adding the smoking radio buttons*/}
      <div className="mt-4">
        <label>
          <input
            type="radio"
            value="non-smoking"
            checked={roomPreference === 'non-smoking'}
            onChange={handleRoomChange}
          />
          Non-Smoking
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="smoking"
            checked={roomPreference === 'smoking'}
            onChange={handleRoomChange}
          />
          Smoking
        </label>
      </div>

      {/* Adding the breafast choice checkboxes */}
      <div className="mt-4">
        <label>
          <input
            type="checkbox"
            value="intercontinental"
            checked={breakfastChoices.intercontinental}
            onChange={handleBreakfastChoices}
          />
          Intercontinental
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            value="allYouCanEat"
            checked={breakfastChoices.allYouCanEat}
            onChange={handleBreakfastChoices}
          />
          All You Can Eat
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            value="aLaCarte"
            checked={breakfastChoices.aLaCarte}
            onChange={handleBreakfastChoices}
          />
          A La Carte
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            pricePerNight={hotel.pricePerNight}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
