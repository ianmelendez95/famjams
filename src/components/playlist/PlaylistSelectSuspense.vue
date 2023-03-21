<script setup lang="ts">
import PlaylistSelect from "@/components/playlist/PlaylistSelect.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n()
</script>

<template>
  <Suspense>
    <template #default>
      <PlaylistSelect/>
    </template>
    <template #fallback>
      <div>{{ t('playlistSelect.loading') }}...</div>
    </template>
  </Suspense>
</template>