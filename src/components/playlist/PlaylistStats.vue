<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";
import {applySecond, averageBy, compareSecondNum, reversed, reverseSecond, second, secondBy} from "@/famjams/util";
import {useI18n} from "vue-i18n";
import PlaylistStatTemplate from "@/components/playlist/stat/PlaylistStatTemplate.vue";
import {getTrackReleaseYear} from "@/famjams/tracks";
import {relativizeToMinimum} from "@/famjams/stats";

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const accessToken = getAccessToken()
if (accessToken == null) {
  router.push("/")
}

const userTracks: Map<UserProfile, Track[]> = await getUsersToTracks(accessToken, route.params.id as string)

const userTrackCounts: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(ts => ts.length))
    .sort(compareSecondNum)

const userTrackPop: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(tracks => averageBy(tracks, t => t.track.popularity)))
    .sort(compareSecondNum)

const userTrackDates: [UserProfile, number][] = [...userTracks.entries()]
    .map(applySecond(tracks => Math.floor(averageBy(tracks, getTrackReleaseYear))))
    .sort(reversed(compareSecondNum))

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
  <div>
    <PlaylistStatTemplate :title="t('playlistStats.year.title')"
                          :subtitle="t('playlistStats.year.subtitle')"
                          :values="reverseSecond(relativizeToMinimum(userTrackDates))"
                          :leaderboard-values="userTrackDates.map(secondBy(
                              v => '\'' + v.toString().slice(2, 4)
                          ))"
    />
  </div>
</template>
