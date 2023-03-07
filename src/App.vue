<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
import { test } from './spotify/test'
import { obfuscate } from "@/famjams/weakObfuscate";

function submit() {
  const passwordField: HTMLInputElement = document.getElementById("password") as HTMLInputElement
  test(passwordField.value)
}

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <input id="password" type="text" name="password"/>
    <button @click="submit">Submit</button>
<!--    <div class="wrapper">-->
<!--      <HelloWorld :msg="`You did it ${name} !`" />-->
<!--    </div>-->
  </header>

<!--  <main>-->
<!--    <TheWelcome />-->
<!--  </main>-->
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
