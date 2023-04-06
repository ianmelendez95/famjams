<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { t } = useI18n()
</script>
<template>
  <div>
    <p class="pb-4">
      {{ t('enroll.p1') }}
    </p>
    <p class="pb-4">
      {{ t('enroll.p2') }}
    </p>
    <p>
      ({{ t('enroll.p3') }})
    </p>
  </div>
</template>