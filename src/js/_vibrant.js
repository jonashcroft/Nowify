import * as Vibrant from 'node-vibrant';
import { setTimeout } from 'timers';

/*-------------
Using node-vibrant, we're gonna extract a palette
of colours from the album artwork and push them into
our own array. From that array, we'll grab a random
colour/text combination and apply that to the page style.

The reason we're grabbing a random swatch is because I originally
defaulted to grab the 'Vibrant' colour swatch, which sometimes
returns null. So if we grab the non-empty ones, we can guarantee
that a colour scheme will apply.

Note - the setTimeout may not be needed here, but I placed it in
there in the event of a delay in the Spotify API fetch.
--------------*/

const getArtWorkColours = () => {

    setTimeout(() => {

        let img       = document.getElementById('artwork').src,
            homeBody  = document.getElementById('background');

        if ( img != '' ) {

            Vibrant.from(img).getSwatches((err, swatches) => {

                let ourColours = [];

                for ( let key in swatches ) {

                    if ( swatches.hasOwnProperty(key) && (swatches[key]) != null ) {

                        ourColours.push( {
                            color: (swatches[key]).getHex(),
                            text: (swatches[key]).getTitleTextColor()
                        } );

                    }
                }

                let randomItem = ourColours[Math.floor( Math.random() * ourColours.length )];

                homeBody.style.backgroundColor = randomItem.color;
                homeBody.style.color           = randomItem.text;

            });

        }

    }, 250);


};

export default getArtWorkColours;