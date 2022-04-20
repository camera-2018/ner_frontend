<script setup lang="ts">
import { reactive, ref } from 'vue'
import { post } from '~/utils/post'
const text = ref()
const tableText: Array<{ name: string; sentences: string }> = reactive([])
const goNER = async() => {
  const url = 'http://127.0.0.1:8000/api/ner'
  const res = post(url, text.value.replace(/\s+/g, ''))
  tableText.splice(0, tableText.length)
  for (let i = 0; i < (await res).data.data.length; i++)
    tableText.push({ name: (await res).data.data[i].name, sentences: (await res).data.data[i].sentences.join('  |  ') })
  // console.log(tableText)
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div text-xl opacity-75>
      {{ t('intro.desc') }}
    </div>

    <div py-3 />
    <textarea
      v-model="text"
      autofocus
      :placeholder="t('intro.whats-your-name')"
      :aria-label="t('intro.whats-your-name')"
      type="text"
      p="x4 y2"
      w="80vw"
      h="300px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
    />
    <div py-3 />
    <div>
      <button
        btn m-3 text-sm
        @click="goNER"
      >
        {{ t('button.go') }}
      </button>
    </div>
    <div py-3 />
    <table b-1 grid place="center">
      <thead>
        <tr>
          <td text="center" w="10vw" b-1>
            name
          </td>
          <td text="center" w="90vw" b-1>
            sentences
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in tableText" :key="n.name">
          <td text="center" w="10vw" b-1>
            {{ n.name }}
          </td>
          <td text="center" w="90vw" b-1>
            {{ n.sentences }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
