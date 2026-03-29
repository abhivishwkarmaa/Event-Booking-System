import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AttendanceController {
  constructor(attendanceService) {
    this.svc = attendanceService;
  }

  mark = asyncHandler(async (req, res) => {
    const data = await this.svc.markAttendance(req.params.id, req.body.bookingCode);
    res.status(201).json(success(data));
  });
}
