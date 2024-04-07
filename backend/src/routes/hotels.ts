import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const paystack = require('paystack')(process.env.PAYSTACK_API_KEY as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 3;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    // helps with ordering of hotels per page
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// api/hotels/999099090
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // we confidently have a hotel id
    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);

router.post(
  "/:hotelId/bookings/transaction-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    // call from the backend for security
    const totalCost = hotel.pricePerNight * numberOfNights;

    try{
      // Create a Paystack transaction
      const transaction = await paystack.transaction.initialize({
      amount: totalCost * 100, // Convert to kobo, paystack base unit
      currency: "NGN",
      // email: req.params.email, // Assuming you have the user's email
      metadata: {
        hotelId,
        userId: req.userId,
        },
      });

      // if client secret doesnt exist/ paystack network issues
      if (!transaction.data.authorization_url) {
        return res.status(500).json({ message: "Error creating payment intent" });
      }

      const response = {
        aunthorizationId: transaction.id,
        authorizationUrl: transaction.data.authorization_url,
        totalCost,
      };

      res.send(response);

    } catch(err){
      console.error(err);
      res.status(500).json({ message: 'Error creating transaction' })
    }
  });

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const authId = req.body.authorizationId;

      const transaction = await paystack.transaction.verify(authId);

      if (!transaction || transaction.status !== 'success') {
        return res.status(400).json({
          message: `Payment not successful. Status: ${transaction.status || 'not found'}`,
        });
      }

      if (
        transaction.metadata.hotelId !== req.params.hotelId ||
        transaction.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment details mismatch" });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        return res.status(400).json({ message: "hotel not found" });
      }

      await hotel.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { branchName: new RegExp(queryParams.branchName, "i") },
    ];
  }

  if (queryParams.guestCount) {
    constructedQuery.guestCount = {
      $gte: parseInt(queryParams.guestCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
