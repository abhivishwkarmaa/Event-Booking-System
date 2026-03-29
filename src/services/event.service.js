import { AppError } from '../utils/AppError.js';
import { mapEvent } from '../utils/mappers.js';

export class EventService {
  constructor(eventRepository) {
    this.events = eventRepository;
  }

  async listUpcoming({ page, limit }) {
    const offset = (page - 1) * limit;
    const { rows, total } = await this.events.findUpcoming({ limit, offset });
    return {
      data: rows.map(mapEvent),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async create(payload) {
    const eventDate = payload.date instanceof Date ? payload.date : new Date(payload.date);
    const id = await this.events.create({
      title: payload.title,
      description: payload.description ?? null,
      eventDate,
      totalCapacity: payload.totalCapacity,
    });
    const row = await this.events.findById(id);
    if (!row) throw new AppError('Could not load event after insert', 500, 'EVENT_LOAD_FAILED');
    return mapEvent(row);
  }
}
