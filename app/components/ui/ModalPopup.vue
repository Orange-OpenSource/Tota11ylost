<script setup lang="ts">
import { Modal } from 'boosted'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  headerImg: { type: String, default: undefined },
  headerBgPrimary: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
})

const route = useRoute()
const router = useRouter()

const modalRef = ref<HTMLElement | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let modal: any

onMounted(() => {
  if (modalRef.value)
    modal = new Modal(modalRef.value)
})

// Hide modal before unmounting the component to prevent modal from remaining when using browser back for example
onUnmounted(() => modal.dispose())

watch(() => props.modelValue, (modelValue) => {
  if (modelValue) {
    // Prevent #modal to be removed in a multi-popup sequence
    setTimeout(() => {
      modal.show()
      router.push({ path: route.path, query: route.query, hash: '#modal' })
    }, 100)
  }
  else {
    // hide modal and router back to remove #modal
    modal.hide()
    if (route.hash.startsWith('#modal'))
      router.back()
  }
})

// Close route on back
watch(() => route.hash, (hashValue) => {
  if (hashValue === '')
    modal.hide()
})

const slots = useSlots()
const hasFooterSlot = computed(() => !!slots.footer)
</script>

<template>
  <div
    id="modal"
    ref="modalRef"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" :class="{ 'modal-xl': large }">
      <div class="modal-content">
        <img
          v-if="headerImg"
          class="modal-img"
          :src="headerImg"
          alt=""
        >

        <div class="modal-header">
          <h1 class="modal-title fs-4">
            {{ title }}
          </h1>
          <!-- Close cross button -->
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            data-bs-title="Close"
          >
            <span class="visually-hidden">Close</span>
          </button>
        </div>
        <div class="modal-body" @click.stop>
          <slot name="body" />
        </div>
        <div v-if="hasFooterSlot" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
