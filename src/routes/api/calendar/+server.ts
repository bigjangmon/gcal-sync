import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCalendarList } from '$lib/calendar';

export const GET: RequestHandler = async () => {
	try {
		const calendarList = await getCalendarList({
			showHidden: true,
			showDeleted: true,
			minAccessRole: 'owner'
		});

		return json({
			success: true,
			data: calendarList
		});
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		return error(500, { message: errorMessage });
	}
};
