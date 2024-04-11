import { useForm } from "react-hook-form";
import {
  TransactionResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  transactionIntent: TransactionResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  guestCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  totalCost: number;
  transactionId: string;
  transactionReference: string;
};

const BookingForm = ({
  currentUser,
  transactionIntent,
}: Props) => {
  const search = useSearchContext();
  const { hotelId } = useParams(); // from url

  const { handleSubmit, register, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      guestCount: search.guestCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: transactionIntent.totalCost,
      transactionId: transactionIntent.authorizationUrl,
      transactionReference: transactionIntent.reference
    },
  });

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: (data) => {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl;
        console.log('Redirecting to:', data.transactionId);
        // window.location.href = data.transactionId;
        console.log(data);
        // showToast({ message: "Booking Saved! Redirecting to payment...", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  const onSubmit = (formData: BookingFormData) => {
    console.log(formData);
    // trigger the mutation for booking a room

    // console.log('Redirecting to:', formData.transactionId);
    window.location.href = formData.transactionId; // Use the transactionId from form data for redirection
    bookRoom(formData);
    // confirm payment here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: NGN{transactionIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-orange-500 text-white p-2 font-bold hover:bg-orange-300 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
