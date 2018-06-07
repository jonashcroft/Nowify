import config from './_config.js';

/*----------------------------------------
Allow the user to authorise Spotify

TODO:
- Limit/scroll song titles that are too long (see: Fall Out Boy)
- Better ' Nothing Playing ' screen
----------------------------------------*/

const initAuthorise = () => {

	/*-------------
	Generate our auth URL using the _config.js settings.
	Generate a random 'state' for security
	Enable/Disable show_dialog in dev to force re-auth.
	--------------*/
	let auth_url = 'https://accounts.spotify.com/authorize?' +
		'client_id=' + config.client_id +
		'&response_type=' + 'token' +
		'&redirect_uri=' + window.location.href +
		'&state=' + Math.random().toString(23).substring(4) +
		// '&show_dialog=true' +
		'&scope=' + 'user-read-currently-playing';

	// Redirect the user to Spotify's account authorisation
	window.location.replace(auth_url);
};

/*-------------
Parse the redirect_uri and return the access
token, we'll pass this through with any
request we make later.
--------------*/
const getAccessToken = (parameter) => {

	let result = '',
		loc          = location.hash.substring(1).split('&'),
		temp         = loc[0].split('='),
		access_token = decodeURIComponent(temp[1]);

		if (temp[0] === parameter) result = decodeURIComponent(temp[1]);

	return result;

};

export { initAuthorise, getAccessToken }