<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";
import {applySecond, compareSecondNum} from "@/famjams/util";
import {useI18n} from "vue-i18n";
import PlaylistStatTemplate from "@/components/playlist/stat/PlaylistStatTemplate.vue";

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
    .map(applySecond(tracks => 
        tracks.reduce((acc, t) => acc + t.track.popularity, 0) / tracks.length))
    .sort(compareSecondNum)
</script>

<template>
  <div class="pb-20">
    <PlaylistStatTemplate :title="t('playlistStats.quantity.title')"
                          :subtitle="t('playlistStats.quantity.subtitle')"
                          :values="userTrackCounts"/>
  </div>
  <div>
    <PlaylistStatTemplate :title="t('playlistStats.popularity.title')"
                          :subtitle="t('playlistStats.popularity.subtitle')"
                          :values="userTrackPop"
                          :show-value="v => v.toFixed(1)"/>
  </div>
</template>
