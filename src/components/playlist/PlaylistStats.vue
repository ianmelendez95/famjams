<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {PlaylistTrack, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";
import {
  averageBy,
  reversed,
} from "@/famjams/util";
import {useI18n} from "vue-i18n";
import PlaylistStatTemplate from "@/components/playlist/stat/PlaylistStatTemplate.vue";
import {getTrackReleaseYear} from "@/famjams/tracks";
import type {UserValue} from '@/famjams/stats'
import {
  getUserTrackArtistMaxCounts,
  relativizeToMinimum, 
  reverseValues,
  userValueComparator
} from "@/famjams/stats";

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const accessToken = getAccessToken()
if (accessToken == null) {
  router.push("/")
}

const userTracks: Map<UserProfile, PlaylistTrack[]> = await getUsersToTracks(accessToken, route.params.id as string)

const userTrackCounts: UserValue[] = [...userTracks.entries()]
    .map(([user, ts]) => ({ user, value: ts.length }))
    .sort(userValueComparator)

const userTrackPop: UserValue[] = [...userTracks.entries()]
    .map(([user, tracks]) => {
      const value = averageBy(tracks, t => t.track.popularity)
      return {
        user,
        value,
        displayValue: value.toFixed(2)
      }
    }).sort(userValueComparator)

const userTrackDates: UserValue[] = [...userTracks.entries()]
    .map(([user, tracks]) => {
      const value = Math.floor(averageBy(tracks, getTrackReleaseYear))
      return {
        user,
        value,
        displayValue: '\'' + value.toString().slice(2, 4)
      }
    }).sort(reversed(userValueComparator))

const userTrackExplicitCounts: UserValue[] = [...userTracks.entries()]
    .map(([user, tracks]) => ({ user, value: tracks.filter(t => t.track.explicit).length }))
    .sort(userValueComparator)

const userTrackArtists: UserValue[] = await getUserTrackArtistMaxCounts(accessToken, userTracks)
</script>

<template>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.quantity.title')"
                          :subtitle="t('playlistStats.quantity.subtitle')"
                          :values="relativizeToMinimum(userTrackCounts)"/>
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.popularity.title')"
                          :subtitle="t('playlistStats.popularity.subtitle')"
                          :values="relativizeToMinimum(userTrackPop)"/>
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.year.title')"
                          :subtitle="t('playlistStats.year.subtitle')"
                          :values="reverseValues(relativizeToMinimum(userTrackDates))"/>
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.explicit.title')"
                          :subtitle="t('playlistStats.explicit.subtitle')"
                          :values="relativizeToMinimum(userTrackExplicitCounts)"/>
  </div>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.artist.title')"
                          :subtitle="t('playlistStats.artist.subtitle')"
                          :values="relativizeToMinimum(userTrackArtists)"/>
  </div>
</template>
