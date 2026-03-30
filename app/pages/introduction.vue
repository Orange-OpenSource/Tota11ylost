<!-- Tota11y Lost - Introduction Page -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'game', title: 'intro.tabTitle' })

const gameStore = useGameStore()
const router = useRouter()

const linkVisible = ref(false)

// Determine link target based on version
const nextPageLink = computed(() => {
  if (gameStore.is30Version) return '/form-registration'
  return '/visual'
})

function onHint(index: number) {
  if (index === 3) {
    linkVisible.value = true
  }
}

function navigateViaLink() {
  router.push(nextPageLink.value)
}
</script>

<template>
  <div>
    <main>
      <div class="mx-4">
        <h2>{{ $t('intro.descriptionHeading') }}</h2>
        <p>{{ $t('intro.descriptionText1') }}</p>
        <p>
          {{ $t('intro.descriptionText2.begin') }}&nbsp;<a
            class="link text-decoration-none no-hover-effect"
            :class="linkVisible ? 'link-info' : 'masked-link no-focus-outline'"
            href="#"
            @click.prevent="navigateViaLink"
          >{{ $t('intro.descriptionText2.here') }}</a>{{ $t('intro.descriptionText2.end') }}
        </p>

        <h2>{{ $t('intro.rulesHeading') }}</h2>
        <ul>
          <li>{{ $t('intro.rule1') }}</li>
          <li>{{ $t('intro.rule2') }}</li>
          <li>{{ $t('intro.rule3') }}</li>
        </ul>

        <button
          class="btn fs-3 p-2 btn-primary my-2"
          data-bs-toggle="modal"
          data-bs-target="#tooBadModal"
        >
          {{ $t('intro.startButton') }}
        </button>

        <!-- "Too bad" Modal -->
        <div
          id="tooBadModal"
          class="modal fade"
          tabindex="-1"
          aria-labelledby="tooBadModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 id="tooBadModalLabel" class="modal-title h5">
                  {{ $t('intro.modalTitle') }}
                </h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal">
                  <span class="visually-hidden">{{ $t('intro.modalButtonClose') }}</span>
                </button>
              </div>
              <div class="modal-body">
                <p>{{ $t('intro.modalBody') }}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  {{ $t('intro.modalButtonClose') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <GameHints page-id="intro" @hint="onHint" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.no-hover-effect {
  cursor: auto !important;

  &:hover {
    text-decoration: none !important;
    color: inherit !important;
  }
}
</style>
