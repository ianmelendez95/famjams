<script setup lang="ts">
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/authCodeWithPkce";
import {setAccessToken} from "@/spotify/api";
import {useI18n} from "vue-i18n";

const router = useRouter()
const { t } = useI18n()

async function handleCode(code: string) {
  sessionStorage.setItem("code", code)

  const accessToken = await getAccessToken(code)
  setAccessToken(accessToken)

  await router.push('/playlist')
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (code) {
    handleCode(code)
  } else {
    router.push('/')
  }
})

</script>

<template>
  <div class="greetings">
    <h3>
      {{ t('callback.redirecting') }}...
    </h3>
  </div>
</template>
