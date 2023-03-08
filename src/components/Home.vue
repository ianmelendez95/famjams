<script setup lang="ts">
import {handleAuth} from "@/famjams/handleAuth";

let password: string

function submit() {
  handleAuth(password)
}
</script>

<template>
  <div>
    <input id="password" name="password" v-model="password"/>
    <input type="button"
           value="Submit"
           @click="submit"/>
  </div>
</template>
