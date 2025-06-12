import { z } from 'zod';
import {
	GOOGLE_TYPE,
	GOOGLE_PROJECT_ID,
	GOOGLE_PRIVATE_KEY_ID,
	GOOGLE_PRIVATE_KEY,
	GOOGLE_CLIENT_EMAIL,
	GOOGLE_CLIENT_ID,
	GOOGLE_AUTH_URI,
	GOOGLE_TOKEN_URI,
	GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
	GOOGLE_CLIENT_X509_CERT_URL,
	GOOGLE_UNIVERSE_DOMAIN
} from '$env/static/private';

export const googleEnvSchema = z.object({
	GOOGLE_TYPE: z.string().default('service_account'),
	GOOGLE_PROJECT_ID: z.string().min(1),
	GOOGLE_PRIVATE_KEY_ID: z.string().min(1),
	GOOGLE_PRIVATE_KEY: z.string().min(1),
	GOOGLE_CLIENT_EMAIL: z.string().email(),
	GOOGLE_CLIENT_ID: z.string().min(1),
	GOOGLE_AUTH_URI: z.string().url().default('https://accounts.google.com/o/oauth2/auth'),
	GOOGLE_TOKEN_URI: z.string().url().default('https://oauth2.googleapis.com/token'),
	GOOGLE_AUTH_PROVIDER_X509_CERT_URL: z
		.string()
		.url()
		.default('https://www.googleapis.com/oauth2/v1/certs'),
	GOOGLE_CLIENT_X509_CERT_URL: z.string().url().min(1),
	GOOGLE_UNIVERSE_DOMAIN: z.string().default('googleapis.com')
});

export type GoogleEnv = z.infer<typeof googleEnvSchema>;

export function validateGoogleEnv(): GoogleEnv {
	return googleEnvSchema.parse({
		GOOGLE_TYPE,
		GOOGLE_PROJECT_ID,
		GOOGLE_PRIVATE_KEY_ID,
		GOOGLE_PRIVATE_KEY,
		GOOGLE_CLIENT_EMAIL,
		GOOGLE_CLIENT_ID,
		GOOGLE_AUTH_URI,
		GOOGLE_TOKEN_URI,
		GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
		GOOGLE_CLIENT_X509_CERT_URL,
		GOOGLE_UNIVERSE_DOMAIN
	});
}
