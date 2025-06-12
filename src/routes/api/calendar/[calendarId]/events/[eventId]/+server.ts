import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvent, updateEvent, deleteEvent, type CalendarEvent } from '$lib/calendar';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { calendarId, eventId } = params;
		const event = await getEvent(calendarId, eventId);

		return json({
			success: true,
			data: event
		});
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		return error(500, { message: errorMessage });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const { calendarId, eventId } = params;
		const eventData: Partial<CalendarEvent> = await request.json();
		const updatedEvent = await updateEvent(calendarId, eventId, eventData);

		return json({
			success: true,
			data: updatedEvent
		});
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		return error(500, { message: errorMessage });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { calendarId, eventId } = params;
		const success = await deleteEvent(calendarId, eventId);

		if (success) {
			return json({
				success: true,
				message: 'Event deleted successfully'
			});
		} else {
			return error(500, { message: 'Failed to delete event' });
		}
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		return error(500, { message: errorMessage });
	}
};
