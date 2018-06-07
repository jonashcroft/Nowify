import config from './_config.js';
import { getAccessToken } from './_auth.js';
import initConnect from './_initConnect.js';
import { getNowPlaying } from './_getNowPlaying.js';

const init = () => {

    /*-------------
    If we already have an Access Token, display
    our Spotify Data, if not - display the
    'Connect' button.
    --------------*/

    if ( getAccessToken('access_token') ) {

        document.body.classList.add('connected');
        config.connectDiv.classList.remove('active');
        config.connectDiv.classList.add('inactive');
        config.nowPlayingDiv.classList.remove('inactive');
        config.nowPlayingDiv.classList.add('active');

        getNowPlaying();

    } else {

        document.body.classList.remove('connected');

        initConnect();

    }

};

export default init;