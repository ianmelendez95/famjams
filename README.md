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

## Technologies Used

Alright now's the time for honesty, this was more of a learning project that just happened to be 
a fun vehicle by involving friends and family. 
Now's the part where I go on about the cool stuff contained in this project.

### Vue 3.x

This project uses the (apparently) brand new Vue 3 library.
Specifically, it uses the new Composition API within Vue 3, which appears to be in the same 
spirit as React's 'functional' components with hooks to support them.

The enforced separation of JS code from the markup is an interesting choice, and
certainly feels more ergonomic in this relatively simple application.
After all, in React the conventional wisdom is for your JSX to have minimal 
embedded JS, with most logic handled ahead of time earlier in the component code.

However, I'd be interested to see how this separation meets more complex scenarios 
where in React you would have an unholy marriage of JSX generating code intermixed with 
idiomatic JS control flow logic. Maybe it's just that good that you never really get there?
(Or maybe I'm just a mediocre React developer that doesn't know better... yeah that's probably it)

### Vue Suspense

The Vue Suspense component is an interesting way to support async setup in their Composition APIs.
You can find examples of these in the [PlaylistSelectSuspense](/src/components/playlist/PlaylistSelectSuspense.vue)
template. By simply wrapping the async component with the `<template #default>` and a fallback 
synchronous component with `<template #fallback>`, you can avoid wrangling with lifecycle methods and 
doing fallback handling inside the same component.

Very clean. Good choice Vue team!

### Spotify API

This application uses the Spotify API (which is exceptional by the way, great work by the Spotify team!)
to access playlist and superficial user information. 

[/src/spotify](src/spotify) contains the core code for interacting with the api.
[authCodeWithPkce.ts](/src/spotify/authCodeWithPkce.ts) is 
shamelessly ripped right out of their excellent [web-api-examples](https://github.com/spotify/web-api-examples/blob/master/get_user_profile/src/authCodeWithPkce.ts) 
repository.

However, [api.ts](/src/spotify/api.ts) and associated [types.d.ts](/src/spotify/types.d.ts) is all my handiwork.
`api.ts` is your usual low level wrapper around `fetch` by wiring up basic auth token, url param generation,
and error handling (I was aware there were some libraries already available, but why not roll my own
and leave maintenance to future me?)

### Spotify API Collections

Now one interesting thing in the `api.ts` file is the `fetchAllItems` function! 
The Spotify API has a predictable response structure when the endpoint returns a collection of items. 
These endpoints respond with a structure that looks like so

```json
{
  "next": "https://api.spotify.com/v1/me/shows?offset=3&limit=3",
  "items": [ "Item 1", "Item 2", "Item 3" ]
}
```

And when there are no items, `"next"` is returned with a null value.

Therefore, you can interact with the api as if an iterator, simply checking if "next" is null
and collecting the results as you go!

Now obviously this elides the nuance of paginating content in favor of a more brutish 
"give me everything now" approach, and it's likely this is standard fare as far as APIs go.
Still, the ergonomics of such an interface was shockingly refreshing compared to some 
more... 'kitchen sink' APIs that exist out there in the enterprise world.

### D3

Another fun piece to the puzzle was using D3.js to generate the donut charts.
The code to generate the donuts can be found in [donut.ts](/src/components/observable/donut.ts).

For this project I started with Observable's excellent [donut chart example](https://observablehq.com/@d3/donut-chart).

The first modification was to add TypeScript types to it, which was no small matter, since
it took full advantage of [destructuring assignment default values](https://observablehq.com/@d3/donut-chart)
AND [default_parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)[default_parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters).
These were a nightmare to try to add types to, so instead I settled for reducing the arguments entirely 
to the subset needed for my purposes, and hardcoding the rest.

The next step was modifying it to render images instead of text, so that I could display the user profile
pictures provided by the Spotify API. It took some wrangling but with the MDN SVG docs in one hand and a
ruler and a protractor I got the images to line up nicely.

### Donut Chart Letter Avatars

Then someone had the audacity to not configure a profile picture for their Spotify profile! 
After their indignant refusal to violate their privacy by putting their face on the public internet,
I had to figure out how to substitute their non-existent image with a simple 'letter avatar'.

The end of the `buildDonut` method in `donut.ts` generates these avatars by first lining up a sufficiently 
sized `<circle>` SVG element for the missing images. Then in a subsequent run lining up the 'initials' of 
the users display name within these circles with finicky `<text>` elements. 
Believe me, this was trickier than it likely should have been,
and perhaps a better solution would be to generate these avatars as images with a proper backend.
Alas, an SPA this project was to be, and so I winged it with what I had.

In conclusion D3 is awesome, SVGs are awesome, and my skill at both are... passable.

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
