<script setup lang="ts">
import {redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
import {onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

onMounted(() => {
  if (localStorage.getItem("accessToken") == null) {
    redirectToAuthCodeFlow();
  } else {
    router.push("/playlist")
  }
})
</script>

<template>
  <div>
    Authorizing...
  </div>
</template>
