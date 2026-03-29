import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class BookingController {
  constructor(bookingService) {
    this.svc = bookingService;
  }

  create = asyncHandler(async (req, res) => {
    const { userId, eventId } = req.body;
    const data = await this.svc.create({ userId, eventId });
    res.status(201).json(success(data));
  });

  listByUser = asyncHandler(async (req, res) => {
    const data = await this.svc.listByUserId(req.params.id);
    res.status(200).json(success(data));
  });
}
