import config from './_config.js';
import { initAuthorise, getAccessToken } from './_auth.js';
import getArtWorkColours from './_vibrant.js';

const getNowPlaying = () => {

    // If user hard reloads, wipe localStorage so we can start again.
    if ( performance.navigation.type == 1 ) {
        localStorage.clear();
    }

    //https://developer.spotify.com/web-api/user-guide/#rate-limiting
    let endpoint = config.base_url,
        token    = getAccessToken('access_token'),

        request = new Request(endpoint + 'me/player/currently-playing', {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        })
    });

    // fetch
    // if is playing

    /*-------------
    We're going to polling the API once every 3ish seconds.
    I'm really, really not happy to be doing this, but there
    is legitimately no other way to get instant updates from
    Spotify at this point via the Web API.
    --------------*/
    setInterval(() => {

        fetch(request)
        .then(response => {
        // response from server
        // here we check status of response and handle it manually
        switch (response.status) {

            /*-------------
            The Spotify token lasts for 60 minutes or so (serverside),
            so once we hit that, we'll get a 401. We'll then run our
            authorisation function again - as the user has already
            granted access at this point, this should auto auth
            like nothing happened (if not, they'll just have to
            manually approve access again)
            --------------*/

            case 401: initAuthorise(); break;
            // case 500: console.error('Some server error'); break;
            // ...
        }
        // if status in the range 200 to 299
        if (response.ok) {
            // I'm sure I should be handling this resolve/reject differently
            return Promise.resolve(response);

        } else {
            // push error further for the next `catch`, like
            // return Promise.reject(response);
            // or another way
            throw Error(response.statusText);
        }
        })
        .then( (response) => response.json() )
        .then( (data) => {

            if ( data.is_playing === true ) {

                getTrackInfo(data);

            } else {

                showTrackIdle();

            }


        })
        .catch( error => {

            console.log(error);

        });
    }, 3800);

};

const getTrackInfo = (data) => {

    /*-------------
    If we're accessing the app for the first time, hide the 'Connect'
    div and replace with our 'Now Playing' div.
    --------------*/
    if ( config.nowPlayingDiv.classList.contains('inactive') ) {

        config.idleDiv.classList.remove('active');
        config.idleDiv.classList.add('inactive');
        config.nowPlayingDiv.classList.remove('inactive');
        config.nowPlayingDiv.classList.add('active');
        config.backgroundDiv.classList.add('song-active');

    }

    /*-------------
    We store the current track ID in local storage - so if that exists,
    we'll store it in a variable and compare it to the track ID of the
    current track (from Spotify).

    This is so that we only refresh the data on the page if the track
    from Spotify is a new/different track.

    Comparing the Track ID was the easiest way I could get the current track
    in the event of a prolonged pause and/or mid-track skip...

    (if there are better ways, I'm all ears)
    --------------*/

    let storedTrackID  = localStorage.getItem('SpotifyTrackID'),
        fetchedTrackID = data.item.id;

    // If there isn't a stored track, or the tracks don't match, get new data.
    if ( storedTrackID == null ||
        storedTrackID != fetchedTrackID ){

        localStorage.setItem('SpotifyTrackID', data.item.id);

        /*-------------
        Loop through the artists and display
        them in a comma separated list
        --------------*/
        let artistList = [];

        for ( let name in data.item.artists ) {
            if (data.item.artists.hasOwnProperty(name)) {
                artistList.push( data.item.artists[name][['name']] );
            }
        }

        let displayArtists = artistList.join(', ');

        document.getElementById('artistName').innerHTML = displayArtists;
        document.getElementById('trackName').innerHTML  = data.item.name;
        document.getElementById('artwork').src          = data.item.album.images[0].url;
        config.backgroundDiv.classList.add('song-active');

        // Set the colour scheme to match the artwork
        getArtWorkColours();

    } else if (storedTrackID == fetchedTrackID){

        // Do nothing
        // console.log('Same Track');

    }

};

const showTrackIdle = () => {

    if ( config.backgroundDiv.getAttribute('style') ){
        config.backgroundDiv.style = '';
    }

    config.nowPlayingDiv.classList.remove('active');
    config.nowPlayingDiv.classList.add('inactive');
    config.backgroundDiv.classList.remove('song-active');
    config.idleDiv.classList.remove('inactive');
    config.idleDiv.classList.add('active');

    // If any previous Track data exists, delete it.
    localStorage.clear();

};

export { getNowPlaying };