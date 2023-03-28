<script setup lang="ts">
// import type {UserProfile} from '@/spotify/types'
import type {Track, UserProfile} from "@/spotify/types";
import {getUsersToTracks} from "@/famjams/playlist";
import {useRoute, useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/api";
import {applySecond, compareSecondNum} from "@/famjams/util";
import PlaylistQuantity from "@/components/playlist/stat/PlaylistQuantity.vue";
import PlaylistPopularity from "@/components/playlist/stat/PlaylistPopularity.vue";

const router = useRouter()
const route = useRoute()

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
  <div class="pb-40">
    <PlaylistQuantity :counts="userTrackCounts"/>
  </div>
  <div>
    <PlaylistPopularity :averages="userTrackPop"/>
  </div>
</template>
