<script setup lang="ts">
import {redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {haveAccessToken} from "@/spotify/api";
import {useI18n} from "vue-i18n";

const router = useRouter()
const { t } = useI18n()

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
    {{ t('home.authorizing') }}...
  </div>
</template>
