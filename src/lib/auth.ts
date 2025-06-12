import { google, type Auth } from 'googleapis';
import { validateGoogleEnv } from './env';
import { GOOGLE_CALENDAR_SCOPES } from './constants';

export function createGoogleAuth(): Auth.JWT {
	const env = validateGoogleEnv();

	const serviceAccountKey = {
		type: env.GOOGLE_TYPE,
		project_id: env.GOOGLE_PROJECT_ID,
		private_key_id: env.GOOGLE_PRIVATE_KEY_ID,
		private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		client_email: env.GOOGLE_CLIENT_EMAIL,
		client_id: env.GOOGLE_CLIENT_ID,
		auth_uri: env.GOOGLE_AUTH_URI,
		token_uri: env.GOOGLE_TOKEN_URI,
		auth_provider_x509_cert_url: env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: env.GOOGLE_CLIENT_X509_CERT_URL,
		universe_domain: env.GOOGLE_UNIVERSE_DOMAIN
	};

	return new google.auth.JWT({
		email: serviceAccountKey.client_email,
		key: serviceAccountKey.private_key,
		scopes: GOOGLE_CALENDAR_SCOPES
	});
}
