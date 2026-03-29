function toIso(v) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  return new Date(v).toISOString();
}

export function mapEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: toIso(row.event_date),
    totalCapacity: row.total_capacity,
    remainingTickets: row.remaining_tickets,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export function mapBookingListRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    eventId: row.event_id,
    bookingCode: row.booking_code,
    bookingDate: toIso(row.booking_date),
    event: {
      title: row.event_title,
      date: toIso(row.event_date),
      totalCapacity: row.total_capacity,
      remainingTickets: row.remaining_tickets,
    },
  };
}

export { toIso };
