<script setup lang="ts">
import PlaylistSelect from "@/components/playlist/PlaylistSelect.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <PlaylistSelect/>
    </template>
    <template #fallback>
      <div>Loading Playlists...</div>
    </template>
  </Suspense>
</template>