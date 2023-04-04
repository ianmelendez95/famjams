<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {PlaylistTrack, PlaylistTrackArtist, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";
import {
  applySecond,
  averageBy,
  compareNum, compareSecondBy, first, firstBy,
  reversed,
  reverseSecond,
  second,
  secondBy,
  traverse
} from "@/famjams/util";
import {useI18n} from "vue-i18n";
import PlaylistStatTemplate from "@/components/playlist/stat/PlaylistStatTemplate.vue";
import {getTrackReleaseYear} from "@/famjams/tracks";
import {countMaxArtistTrackCount, fetchPlaylistArtistImages, relativizeToMinimum} from "@/famjams/stats";
import {onMounted} from "vue";

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const accessToken = getAccessToken()
if (accessToken == null) {
  router.push("/")
}

const userTracks: Map<UserProfile, PlaylistTrack[]> = await getUsersToTracks(accessToken, route.params.id as string)

const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(ts => ts.length))
    .sort(compareSecondBy(compareNum))

const userTrackPop: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(tracks => averageBy(tracks, t => t.track.popularity)))
    .sort(compareSecondBy(compareNum))

const userTrackDates: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(tracks => Math.floor(averageBy(tracks, getTrackReleaseYear))))
    .sort(reversed(compareSecondBy(compareNum)))

const userTrackExplicitCounts: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(tracks => tracks.filter(t => t.track.explicit).length))
    .sort(compareSecondBy(compareNum))

// TODO - get the artist images to show in the leaderboard
const userTrackArtists: [UserProfile, [PlaylistTrackArtist, number]][] = [...userTracks.entries()]
    .map(applySecond(countMaxArtistTrackCount))
    .sort(compareSecondBy(compareSecondBy(compareNum)))
const userTrackArtistNames: string[] = userTrackArtists.map(secondBy(firstBy(a => a.name)))
const userTrackArtistImages: string[] = await fetchPlaylistArtistImages(accessToken, userTrackArtists.map(secondBy(first)))

onMounted(() => {
  userTrackArtists.forEach(([u, [a, c]]) => {
    console.log(u.display_name, a.name, c)
  })
})
</script>

<template>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.quantity.title')"
                          :subtitle="t('playlistStats.quantity.subtitle')"
                          :values="relativizeToMinimum(userTrackCounts)"
                          :leaderboard-values="userTrackCounts.map(second)"/>
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.popularity.title')"
                          :subtitle="t('playlistStats.popularity.subtitle')"
                          :values="relativizeToMinimum(userTrackPop)"
                          :leaderboard-values="userTrackPop.map(secondBy(
                              v => v.toFixed(1)
                          ))"/>
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.year.title')"
                          :subtitle="t('playlistStats.year.subtitle')"
                          :values="reverseSecond(relativizeToMinimum(userTrackDates))"
                          :leaderboard-values="userTrackDates.map(secondBy(
                              v => '\'' + v.toString().slice(2, 4)
                          ))"
    />
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.explicit.title')"
                          :subtitle="t('playlistStats.explicit.subtitle')"
                          :values="relativizeToMinimum(userTrackExplicitCounts)"
                          :leaderboard-values="userTrackExplicitCounts.map(second)"
    />
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.artist.title')"
                          :subtitle="t('playlistStats.artist.subtitle')"
                          :values="relativizeToMinimum(userTrackArtists.map(applySecond(second)))"
                          :leaderboard-values="userTrackArtists.map(secondBy(second))"
                          :leaderboard-misc-images="userTrackArtistImages"
                          :leaderboard-misc-text="userTrackArtistNames"
    />
  </div>
</template>
