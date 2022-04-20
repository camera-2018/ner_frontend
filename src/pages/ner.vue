<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
function go() {
  router.push('/')
}
</script>
<template>
  <div i-carbon-3d-print-mesh inline-block />
  <div>TheNER</div>
  <div>
    <button
      btn m-3 text-sm
      @click="go"
    >
      {{ t('button.go') }}
    </button>
  </div>
</template>

<style>

</style>
