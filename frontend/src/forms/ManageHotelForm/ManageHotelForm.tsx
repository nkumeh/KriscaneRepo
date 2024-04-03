import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
// import { HotelType } from "../../../../backend/src/shared/types";
// import { useEffect } from "react";

export type HotelFormData = {
  branchName: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  guestCount: number;
};

type Props = {
  // hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({onSave, isLoading}: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit } = formMethods;

  // useEffect(() => {
  //   reset(hotel);
  // }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    // console.log("image url")
    // console.log(formDataJson.imageUrls)

    console.log(formDataJson);

    const formData = new FormData();
    // if (hotel) {
    //   formData.append("hotelId", hotel._id);
    // }
    formData.append("branchName", formDataJson.branchName);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString());
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("guestCount", formDataJson.guestCount.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // // loading up images seem to be causing an error here...

    console.log(formDataJson);

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    console.log(formDataJson);

    // if (formDataJson.imageUrls) {
    //   console.log(formDataJson.imageUrls)
    //   formDataJson.imageUrls.forEach((url, index) => {
    //     console.log(index, url)
    //     formData.append(`imageUrls[${index}]`, url);
    //   });
    // }

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-orange-500 text-white p-2 font-bold hover:bg-orange-300 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
            {/* Save */}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
