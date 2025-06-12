import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents, createEvent, type CalendarEvent } from '$lib/calendar';

export const GET: RequestHandler = async ({ params, url }) => {
	try {
		const { calendarId } = params;
		const timeMin = url.searchParams.get('timeMin') ?? undefined;
		const timeMax = url.searchParams.get('timeMax') ?? undefined;
		const maxResults = url.searchParams.get('maxResults')
			? parseInt(url.searchParams.get('maxResults')!)
			: undefined;
		const orderBy =
			(url.searchParams.get('orderBy') as 'startTime' | 'updated' | null) ?? undefined;
		const singleEvents = url.searchParams.get('singleEvents') === 'true';

		const events = await getEvents(calendarId, {
			timeMin,
			timeMax,
			maxResults,
			orderBy,
			singleEvents
		});

		return json({
			success: true,
			data: events
		});
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		return error(500, { message: errorMessage });
	}
};

export const POST: RequestHandler = async ({ params, request }) => {
	try {
		const { calendarId } = params;
		const eventData: CalendarEvent = await request.json();
		const createdEvent = await createEvent(calendarId, eventData);

		return json(
			{
				success: true,
				data: createdEvent
			},
			{ status: 201 }
		);
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		return error(500, { message: errorMessage });
	}
};
