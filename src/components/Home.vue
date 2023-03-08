<script setup lang="ts">
import {test} from "@/spotify/test";

let password: string

function submit() {
  test(password)
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
