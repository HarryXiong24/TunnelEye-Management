<template>
  
</template>

<script>
import moment from 'moment'

export default {
  mounted() {
    let localLocale = moment('2021.5.1');
    localLocale.locale('zh-cn')
    let result = localLocale.format('dddd')
    console.log(result);
  },
}
</script>

<style>

</style>