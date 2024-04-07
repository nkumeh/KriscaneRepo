// import { useQuery } from "react-query";
// import * as apiClient from "../api-client";
// import BookingForm from "../forms/BookingForm/BookingForm";
// import { useSearchContext } from "../contexts/SearchContext";
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import BookingDetailsSummary from "../components/BookingDetailsSummary";
// import { usePaystackPayment } from "../hooks/usePaystackPayment";

// const Booking = () => {
//   const search = useSearchContext();
//   const { hotelId } = useParams();

//   const { initializePayment } = usePaystackPayment();

//   const [numberOfNights, setNumberOfNights] = useState<number>(0);

//   useEffect(() => {
//     if (search.checkIn && search.checkOut) {
//         // logic to calculate number of nights
//       const num_nights =
//         Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
//         (1000 * 60 * 60 * 24); // from milisecs to days

//       setNumberOfNights(Math.ceil(num_nights)); // ceiling value of nights 
//     }
//   }, [search.checkIn, search.checkOut]); // if reruns ing global state we maintain these

//   const { data: transactionIntentData } = useQuery(
//     "createPaymentIntent",
//     () =>
//       apiClient.createTransactionIntent(
//         hotelId as string,
//         numberOfNights.toString()
//       ),
//     {
//       enabled: !!hotelId && numberOfNights > 0,
//     }
//   );

//   const { data: hotel } = useQuery(
//     "fetchHotelByID",
//     () => apiClient.fetchHotelById(hotelId as string),
//     {
//       enabled: !!hotelId,
//     }
//   );

//   const { data: currentUser } = useQuery(
//     "fetchCurrentUser",
//     apiClient.fetchCurrentUser
//   );

// //   sanity check
//   if (!hotel) {
//     return <></>;
//   }

//   // Function to initialize Paystack payment
//   const initializePayment = () => {
//     if (!window.PaystackPop) {
//       console.error('Paystack script not loaded');
//       return;
//     }

//   return (
//     <div className="grid md:grid-cols-[1fr_2fr]">
//       <BookingDetailsSummary
//         checkIn={search.checkIn}
//         checkOut={search.checkOut}
//         guestCount={search.guestCount}
//         numberOfNights={numberOfNights}
//         hotel={hotel}
//       />
//       {currentUser && transactionIntentData && (
//         <div></div>
//         // <Elements
//         //   options={{
//         //     authId: transactionIntentData.authorizationId,
//         //   }}
//         // >
//         //   <BookingForm
//         //     currentUser={currentUser}
//         //     transactionIntent={transactionIntentData}
//         //   />
//         // </Elements>
//       )}
//     </div>
//   );
// };

// export default Booking;
