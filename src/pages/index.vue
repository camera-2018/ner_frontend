<script setup lang="ts">
import { reactive, ref } from 'vue'
import { post } from '~/utils/post'
import { textExamples } from '~/utils/textexample'
const text = ref()
const isNewApi = ref(true)
const isLoading = ref()
const isNull = ref(false)
const displayTable = ref(false)
const tableText: Array<{ name: string; sentences: string }> = reactive([])
const changeLoading = async(value: boolean) => {
  isLoading.value = value
}
const showRandomText = () => {
  const random = Math.floor(Math.random() * (4 - 0 + 1)) + 0
  text.value = textExamples[random]
  displayTable.value = false
}
const cleanText = () => {
  text.value = ''
  displayTable.value = false
}
const goNER = async() => {
  changeLoading(true)

  const url = isNewApi.value ? 'http://xyxsw.ltd:3539/api/ner' : 'http://xyxsw.ltd:3539/api/ner'
  if (!text.value || text.value.replace(/\s+/g, '').length === 0) {
    await changeLoading(false)
    alert('请输入文本')
    return
  }
  const res = post(url, text.value.replace(/\s+/g, ''))
  tableText.splice(0, tableText.length)
  if ((await res).data.data.length === 0)
    isNull.value = true
  else
    isNull.value = false
  for (let i = 0; i < (await res).data.data.length; i++)
    tableText.push({ name: (await res).data.data[i].name, sentences: (await res).data.data[i].sentences.join('  |  ') })
  await changeLoading(false)
  displayTable.value = true
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div text-2xl opacity-75>
      {{ t('intro.desc') }}
    </div>
    <div py-1 />
    <div text-xs opacity-75>
      <span>{{ t('items.api') }}</span>
      <label>
        <input v-model="isNewApi" type="checkbox" class="checkbox" @click="isNewApi = !isNewApi">
      </label>
    </div>
    <div py-3 />
    <textarea
      v-model="text" autofocus :placeholder="t('intro.whats-your-name')+ '\n' +(isNewApi?t('items.newApi'):t('items.oldApi'))"
      :aria-label="t('intro.whats-your-name')" type="text" p="x4 y2" w="80vw" h="300px" text="center" bg="transparent"
      border="~ rounded gray-200 dark:gray-700" outline="none active:none"
    />
    <div py-3 />
    <div>
      <button btn m-3 text-sm @click="cleanText">
        {{ t('items.clean') }}
      </button>
      <button btn m-3 text-sm @click="showRandomText">
        {{ t('items.random') }}
      </button>
      <button btn m-3 text-sm @click="goNER">
        {{ !isLoading ? t('button.go') : t('button.loading') }}
      </button>
    </div>
    <div py-3 />
    <table v-if="displayTable" b-1 grid place="center">
      <thead>
        <tr>
          <td text="center" w="10vw" b-1>
            {{ t('items.name') }}
          </td>
          <td text="center" w="90vw" b-1>
            {{ t('items.sentences') }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isNull">
          <td text="center" w="100vw" b-1>
            {{ t('items.null') }}
          </td>
        </tr>
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

<style>
label {
  transform: translateY(-16.5px) translateX(-32px) scale(0.25);
  width: 100px;
  height: 50px;
  border: solid 1px #ddd;
  background: #ddd;
  border-radius: 25px;
  position: absolute;
}
label input {
  visibility: hidden;
}

label input::after {
  visibility: visible;
  content: '';
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  border-radius: 50%;
  left: 5px;
  top: 5px;
  transition: all 0.2s;
}

label input:checked::after {
  transform: translateX(50px);
}

label input::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  visibility: visible;
  transition: all 0.2s;
  border-radius: 25px;

}

label input:checked::before {
  background: rgba(13, 148, 136);
}
</style>
