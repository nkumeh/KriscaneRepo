// declare global {
//     interface Window {
//       PaystackPop: any;
//     }
//   };

// export const usePaystackPayment = () => {
//     const initializePayment = ({ email, amount, reference, publicKey }) => {
//       const handler = window.PaystackPop.setup({
//         key: publicKey,
//         email: email,
//         amount: amount * 100, // Convert amount to kobo
//         reference: reference,
//         callback: (response) => {
//           // handle successful transaction here
//           console.log(response); // Process the verification of the transaction
//         },
//         onClose: () => {
//           // Handle the case when the payment modal is closed
//           console.log("Transaction was not completed.");
//         },
//       });
//       handler.openIframe();
//     };
  
//     return { initializePayment };
//   };
  