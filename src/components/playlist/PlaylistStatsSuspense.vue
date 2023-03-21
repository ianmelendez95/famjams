<script setup lang="ts">
import PlaylistStats from "@/components/playlist/PlaylistStats.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n()
</script>

<template>
  <Suspense>
    <template #default>
      <PlaylistStats/>
    </template>
    <template #fallback>
      <div>{{ t('playlistStats.analyzing') }}...</div>
    </template>
  </Suspense>
</template>