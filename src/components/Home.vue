<script setup lang="ts">
import {redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {haveAccessToken} from "@/spotify/api";

const router = useRouter()

onMounted(() => {
  if (haveAccessToken()) {
    router.push("/playlist")
  } else {
    redirectToAuthCodeFlow();
  }
})
</script>

<template>
  <div>
    Authorizing...
  </div>
</template>
