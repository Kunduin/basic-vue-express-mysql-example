<template>
  <section class="site">
    <main class="site-content">
      <section class="login-section">
        <div class="login-title">
          Gallery
        </div>
        <router-view/>
      </section>
    </main>
    <footer>
      made by 吴新宇 @161250157
    </footer>
  </section>
</template>

<script>
export default {
  name: "LoginLayout"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../style/config";

.site {
  color: rgba(255, 255, 255, 0.438);
  text-align: center;
  font-family: "IBM Plex Sans", sans-serif;
  background: url("../assets/asteroids.jpg");
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.site-content {
  flex: 1;
}
.login-title {
  padding: 30px 0 10px;
  text-align: center;
  color: white;
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 70px;
}

.login-section {
  background-color: rgba(48, 51, 58, 0.849);
  margin: 25vh auto 0;
  width: 350px;
  padding: 20px;
  border-radius: 5px;
  border: 5px solid #24252d;
}

.intro {
  color: $oc-gray-7;
  text-align: center;
  font-size: 25px;
  padding: 10px 0 30px;
}

.link {
  color: $oc-blue-5;
  text-decoration: none;
}

.action-section {
  display: flex;
  justify-content: space-between;
}

.form {
  padding: 0 20px;
}

input[type="username"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 30px 0;
  display: block;
  border: 2px solid #3e3f48;
  border-radius: 1000px;
  box-sizing: border-box;
  background: #24252d;
  color: white;
  outline: 0;
  transition: all 0.5s;
}

input[type="username"]:focus,
input[type="password"]:focus {
  border: 2px solid #7c6d7d;
}

input[type="username"]:valid,
input[type="password"]:valid {
  border: 2px solid $oc-green-4;
}

.error-action {
  background: $oc-red-6;
  color: white;
  padding: 10px 10px;
  width: 80%;
  border-radius: 10000px;
  margin: 0 auto;
}

.submit-action {
  width: 60%;
  padding: 12px 20px;
  display: inline-block;
  border: 0;
  border-radius: 1000px;
  font-family: "IBM Plex Sans", sans-serif;
  box-sizing: border-box;
  background: #303eaa;
  color: white;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
}

.submit-action:hover {
  background: #3648ca;
}

.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
}

.register-link {
  padding-right: 10px;
  color: gray;
  text-decoration: none;
}
</style>
