<script setup lang="ts">
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {getAccessToken} from "@/spotify/authCodeWithPkce";

const router = useRouter()

async function handleCode(code: string) {
  localStorage.setItem("code", code)
  const clientId = localStorage.getItem("clientId") as string

  const accessToken = await getAccessToken(clientId, code)

  localStorage.setItem("accessToken", accessToken)

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
      Redirecting...
    </h3>
  </div>
</template>
