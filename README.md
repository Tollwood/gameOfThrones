![build status](https://travis-ci.org/Tollwood/gameOfThrones.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Tollwood/gameOfThrones/badge.svg?branch=master)](https://coveralls.io/github/Tollwood/gameOfThrones?branch=master)


# Game of Thrones learning by doing

A clone of the game of Thrones board game. Goal of this project is to implement a more complex application learning new technologies build a game I would like to play more often.

**[Trello Board](https://trello.com/b/IM4aFTeY/game-of-thrones)** to track current planned, ongoing and completed feautres

Completed Features:
- 
- asdasd

Planned Features:
-
- Multiplayer
- Mobile Friendly
- complete Feature Rule Set
- UI improvements (Animation, better/ other graphics)

Technolgies
-
- Phaser.io
- Typescript
- Webpack
- Redux
- Express Server


[Testing](https://coveralls.io/github/Tollwood/gameOfThrones)
-
- Karma, Jasmine, 
- sourcemap-istanbul-instrumenter-loader
- coveralls

[Continous Integration](https://travis-ci.org/Tollwood/gameOfThrones)
-
- Each branch is build and tested using Travis

[Continous Deployment](https://dashboard.heroku.com/apps/got-tollwood)
-
- setup inspired by: [this article ](https://codeforgeek.com/2017/03/deploy-awesome-angular-app-heroku/)
- Each build on master will be deployed to Heroku cloud

[Live Demo](https://got-tollwood.herokuapp.com/)!!! Try it out
-

## Bugs/Issues?

If you have any issues please let me know via [GitHub Issues][issues]!

## Requests/Suggestions?

If you have any requests or suggestion for the project please let me know via [GitHub Issues][issues]!



## Existing Features from fork:
- No hassle asset management requiring no code, on your part, to load and parse assets
  - Assets are required and hashed via webpack, you can now guarantee that when you push an update, everyone will get the new files and not cached ones
  - Assets class created automatically allowing you to access all the assets and their frames and sprites (in the case of Atlases and Audiosprites) in a compiler validating way!
- Setting up the game size and scaling through a script that does it all for you
  - Automatic template background
  - Sets up the size the game so that it is scaled only when absolutely necessary 
  - Refer to src/utils/utils.ts for an explanation on the background_template and the sizing/scaling style

### Generate Assets Class:

This project will manage your assets for you! All you need to do is drop your assets in assets/ (subdirectories do not matter) and run (you need to run this manually if you change assets while the server is running, otherwise it's run automatically when running a build);

```npm run assets```

or (if your dev GOOGLE_WEB_FONTS is different from your dist);

```npm run assets:dev```

src/assets.ts will be generated which contains sections for all your asset types (the generator is smart enough to distinguish what assets are what !) and classes for every asset, it will also generate an enum containing every frame and sprite in Atlases and AudioSprites respectively! 

No need to remember keys, frames, or sprites anymore; which means no more typos resulting in asset not found errors. Just use, for example, Assets.Images.ImagesBackgroundTemplate.getName() or Assets.Audiosprites.AudiospritesSfx.Sprites.Laser1. This also allows the compiler to warn you if you are trying to use an asset that doesn't exist!

The preloader will use this class to load everything, **you don't have to do anything in code to get your assets loading and available (except for any assets you need for your loading screen...)**!

Currently supports the following (if you need a new extension or find an issue with one of your assets not exporting correctly, just let me know);

- Images:
  - bmp, gif, jpg, jpeg, png, webp
- Spritesheets:
  - bmp, gif, jpg, jpeg, png, webp
  - \[frameWidth, frameHeight, frameMax, margin, spacing\] - frameWidth & frameHeight are required.
  - Example: spritesheet.\[100, 100\].png
- Atlases:
  - bmp, gif, jpg, jpeg, png, webp
  - json (the loader figures out if it's a JSONArray or JSONHash, no need to remember or care), xml
- Audio:
  - aac, ac3, caf, flac, m4a, mp3, mp4, ogg, wav, webm
- Audiosprites:
  - aac, ac3, caf, flac, m4a, mp3, mp4, ogg, wav, webm
  - json
- Local Fonts:
  - eot, otf, svg, ttf, woff, woff2
  - css
- Bitmap Font:
  - bmp, gif, jpg, jpeg, png, webp
  - xml, fnt
- JSON:
  - json
- XML:
  - xml
- Text:
  - txt
- Scripts:
  - js
- Shaders:
  - frag
  
Which version of the audio to load is defined in the webpack.dev.config.js and webpack.dist.config.js under the DefinePlugin 'SOUND_EXTENSIONS_PREFERENCE' section;
- Currently I set the order to: webm, ogg, m4a, mp3, aac, ac3, caf, flac, mp4, wav
- The loader will load the audio using this as the preference; the first supported file that is found is used using the order of this list as most preferred to least preferred

## Change the game size and generate a template background:

Note: This is automatically run after running npm install, however you may want to run it again (if you deleted the background.png and want it back, or if you want to change the game size from the default).

Run:

```npm run setupGameSize```

This will run a script that will generate a template background showing the safe and decoration area of your game when it is sized or scaled for different devices as well as updating a couple global values in the webpack configs so that the game knows about the new size when built.

If you do not want the default 800 x 500 with this scaling style, run the following and all will be updated.

**DO NOT MODIFY THE (DEFAULT or MAX)\_GAME\_(WIDTH or HEIGHT) OR SCALE_MODE PLUGINS DEFINED IN THE WEBPACK CONFIGS, OR THIS WILL NOT WORK**;

Run the following for descriptions and default values for all possible options;

```npm run setupGameSize -- -h```

Run the following specifying some or all of the options;

```npm run setupGameSize -- --width [whatever width you want] --height [whatever height you want] --aspect-ratio [If you want a different default aspect ratio] --scale-mode [one of the Phaser Scale Modes] [--no-png]```

**The '--' after setupGameSize is not a mistake; it is required to pass arguments along to the script.**

You can either provide the width **and** height (defaults 800 and 500 respectively) and as long as they result in an aspect ratio of what's set in the script or by --aspect-ratio (default 1.6 or 16:10), or you can provide the width **or** height and the one you didn't provide will be calculated for you. 

Providing --scale-mode will set this.game.scale.scaleMode to the corresponding Phaser.ScaleManager.SCALE_MODE (default USER_SCALE).

If you do not want the background to be created just add the flag --no-png (not putting this will let the background generate).
