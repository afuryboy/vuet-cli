<template>
  <div class="app">
    <h1>{{msg}}</h1>
    <div>
      <img src="~static/imgs/logo.png" alt="">
      <img src="~assets/imgs/logo.png" alt="">
      <div>{{docMsg}}<a href="">vuet-cli documentation</a></div>
    </div>
  </div>
</template>
<% if(useTs) {-%>
<script lang="ts">
  import Vue from "vue";
  export default Vue.extend({
<%} else {-%>
<script>
  export default {
<%}-%>
    name: 'app',
    data() {
      return {
        msg: 'welcome vuet',
        docMsg: `For a guide and recipes on how to configure / customize this project,check out the`
      }
    }
  }<% if(useTs) {-%>)<%}%>
</script>
<style>
.app{
  text-align: center;
}
</style>