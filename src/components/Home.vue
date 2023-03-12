<script setup lang="ts">
import {deObfuscate} from "@/famjams/obfuscate";
import {CLIENT_ID, PLAYLIST_ID} from "@/famjams/constants";
import {redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";

let password: string

async function submit() {
  const clientId = await deObfuscate(password, CLIENT_ID)
  const playlistId = await deObfuscate(password, PLAYLIST_ID)

  localStorage.setItem("clientId", clientId)
  localStorage.setItem("playlistId", playlistId)

  await redirectToAuthCodeFlow(clientId);
}
</script>

<template>
  <div>
    <input id="password" name="password" v-model="password" v-on:keyup.enter="submit" autofocus/>
    <input type="button"
           value="Submit"
           @click="submit"/>
  </div>
</template>
