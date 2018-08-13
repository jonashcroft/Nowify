# Nowify
A simple app to display visuals of your current Spotify track. Designed to be used on a Raspberry Pi.

[https://jonashcroft.co.uk/nowify](https://jonashcroft.co.uk/nowify)

[https://jonashcroft.co.uk/2018/05/14/now-playing-screen-spotify-raspberry-pi-es6/](https://jonashcroft.co.uk/2018/05/14/now-playing-screen-spotify-raspberry-pi-es6/)

## How to set up

 1. Ensure that [Gulp](https://gulpjs.com/) is installed
 2. Log in to [Spotify Dashboard](https://developer.spotify.com/dashboard/applications) and create a new client
 3. Enter your **Client ID** and **Client Secret** in `src/js/_config.js`
 4. In terminal, navigate to your cloned directory and install the npm packages: `npm install babel-core babel-preset-env babel-register babelify browser-sync browserify browsersync eslint gulp gulp-autoprefixer gulp-babel gulp-concat gulp-cssnano gulp-notify gulp-plumber gulp-rename gulp-sass gulp-sourcemaps gulp-uglify vinyl-buffer vinyl-source-stream node-vibrant --save-dev`
 5. Once installed, enter `gulp` to run Gulp
 6. You'll need to save a SCSS and JS file in the `/src/` folder to initially compile the code and create a `/dist/` folder.

## Notes

I originally built this for personal use and decided to share the source code, so things could very well be broken and/or be done better.