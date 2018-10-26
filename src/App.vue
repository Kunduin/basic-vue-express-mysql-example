<template>
  <router-view/>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
:root {
  --max-width: 1000px;
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  background: #05071d;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

footer {
  color: rgba(255, 255, 255, 0.438);
  text-align: center;
  line-height: 50px;
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 20px;
}

main {
  flex: 1;
}
</style>
