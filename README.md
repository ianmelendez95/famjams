# Family Jamz

Ever wonder who's the 'old soul' of the group? Well if music taste is 
any indication, here you can find out by analyzing your shared Spotify playlists.

Get a cheeky report of some selection habits of your friends tracks, like 
'oldest average track release date' or 'number of explicit tracks'. Compare and
reflect on what your friends contributions say about them as a person (just kidding, it's not that deep, but 
can definitely lead to some fun conversations!)

<p align="center">
  <img alt="Track Count Image" src="readme/quantity-stat.png" height="300"/>
</p>

<p align="center">
  <img alt="Track Date Image" src="readme/date-stat.png" height="300"/>
</p>

## Spotify API

This application uses the Spotify API (which is exceptional by the way, great work by the Spotify team!)
to access playlist information.

When first opening the app, you will be redirected to Spotify's authentication portal, where you can 
allow the app to access playlists and their content.

## To-Do

- (Long Term) Add first-class support for adding categories with 'plugin' system

## Project Setup

```sh
npm install
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
