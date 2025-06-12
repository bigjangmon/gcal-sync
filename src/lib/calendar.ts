import { calendar_v3, google } from 'googleapis';
import { createGoogleAuth } from './auth';

export type CalendarEvent = calendar_v3.Schema$Event;
export type CalendarList = calendar_v3.Schema$CalendarList;
export type Calendar = calendar_v3.Schema$Calendar;
export type EventsListResponse = calendar_v3.Schema$Events;

function getCalendarClient() {
	const auth = createGoogleAuth();
	return google.calendar({ version: 'v3', auth });
}

export async function getCalendarList(params?: {
	showHidden?: boolean;
	showDeleted?: boolean;
	minAccessRole?: 'freeBusyReader' | 'owner' | 'reader' | 'writer';
}): Promise<CalendarList> {
	try {
		const calendar = getCalendarClient();

		const response = await calendar.calendarList.list({
			showHidden: params?.showHidden,
			showDeleted: params?.showDeleted,
			minAccessRole: params?.minAccessRole
		});
		console.log('getCalendarList', response);
		return response.data;
	} catch (error) {
		console.error('Failed to get calendar list:', error);
		throw new Error(
			`Failed to get calendar list: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function getCalendar(calendarId: string): Promise<Calendar> {
	try {
		const calendar = getCalendarClient();

		const response = await calendar.calendars.get({
			calendarId
		});

		return response.data;
	} catch (error) {
		console.error('Failed to get calendar:', error);
		throw new Error(
			`Failed to get calendar: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function getEvents(
	calendarId: string,
	params?: {
		timeMin?: string;
		timeMax?: string;
		maxResults?: number;
		orderBy?: 'startTime' | 'updated';
		singleEvents?: boolean;
	}
): Promise<EventsListResponse> {
	try {
		const calendar = getCalendarClient();

		const response = await calendar.events.list({
			calendarId,
			timeMin: params?.timeMin,
			timeMax: params?.timeMax,
			maxResults: params?.maxResults,
			orderBy: params?.orderBy,
			singleEvents: params?.singleEvents
		});

		return response.data;
	} catch (error) {
		console.error('Failed to get events:', error);
		throw new Error(
			`Failed to get events: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function createEvent(
	calendarId: string,
	eventData: CalendarEvent
): Promise<CalendarEvent> {
	try {
		const calendar = getCalendarClient();

		// Service account cannot invite attendees without Domain-Wide Delegation, so remove it
		const { attendees, ...eventDataWithoutAttendees } = eventData;

		if (attendees && attendees.length > 0) {
			console.warn('Service account cannot invite attendees. Attendees field removed.');
		}

		const response = await calendar.events.insert({
			calendarId,
			requestBody: eventDataWithoutAttendees
		});

		return response.data;
	} catch (error) {
		console.error('Failed to create event:', error);
		throw new Error(
			`Failed to create event: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function updateEvent(
	calendarId: string,
	eventId: string,
	eventData: Partial<CalendarEvent>
): Promise<CalendarEvent> {
	try {
		const calendar = getCalendarClient();

		const response = await calendar.events.update({
			calendarId,
			eventId,
			requestBody: eventData
		});

		return response.data;
	} catch (error) {
		console.error('Failed to update event:', error);
		throw new Error(
			`Failed to update event: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function deleteEvent(calendarId: string, eventId: string): Promise<boolean> {
	try {
		const calendar = getCalendarClient();

		await calendar.events.delete({
			calendarId,
			eventId
		});

		return true;
	} catch (error) {
		console.error('Failed to delete event:', error);
		throw new Error(
			`Failed to delete event: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}

export async function getEvent(calendarId: string, eventId: string): Promise<CalendarEvent> {
	try {
		const calendar = getCalendarClient();

		const response = await calendar.events.get({
			calendarId,
			eventId
		});

		return response.data;
	} catch (error) {
		console.error('Failed to get event:', error);
		throw new Error(
			`Failed to get event: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}
