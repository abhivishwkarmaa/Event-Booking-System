import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class EventController {
  constructor(eventService) {
    this.svc = eventService;
  }

  list = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const { data, meta } = await this.svc.listUpcoming({ page, limit });
    res.status(200).json(success(data, meta));
  });

  create = asyncHandler(async (req, res) => {
    const created = await this.svc.create(req.body);
    res.status(201).json(success(created));
  });
}
