<!-- Test Page - List of all game pages -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

const gameStore = useGameStore()

const pages = [
  { name: 'Welcome', path: '/' },
  { name: 'Introduction', path: '/introduction' },
  { name: 'Visual', path: '/visual' },
  { name: 'Visual Simulation', path: '/visual-simulation' },
  { name: 'Cognitive', path: '/cognitive' },
  { name: 'Cognitive Simulation', path: '/cognitive-simulation' },
  { name: 'Physical', path: '/physical' },
  { name: 'Physical Simulation', path: '/physical-simulation' },
  { name: 'Hearing', path: '/hearing' },
  { name: 'Hearing Simulation', path: '/hearing-simulation' },
  { name: 'Form Registration', path: '/form-registration' },
  { name: 'Form Satisfaction', path: '/form-satisfaction' },
  { name: 'Scores', path: '/scores' },
]

function setGameVersion(version: '15' | '30' | '60') {
  gameStore.setVersion(version)
}
</script>

<template>
  <div class="container my-5">
    <h1 class="mb-4">
      Test Page - Game Pages
    </h1>

    <div class="card">
      <div class="card-body">
        <h5 class="card-title">
          Available Game Pages
        </h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Go</th>
              <th>Debug</th>
              <th>Path</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in pages" :key="page.path">
              <td>
                <NuxtLink :to="page.path" class="btn btn-sm btn-primary">
                  Go
                </NuxtLink>
              </td>
              <td>
                <NuxtLink :to="`${page.path}?debug=true`" class="btn btn-sm btn-warning">
                  Debug
                </NuxtLink>
              </td>
              <td><code>{{ page.path }}</code></td>
              <td>{{ page.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <h5 class="card-title">
          Quick Version Testing
        </h5>
        <p>Test specific game versions:</p>
        <div class="btn-group gap-2" role="group">
          <button class="btn btn-sm btn-info" @click="setGameVersion('15')">
            15 min
          </button>
          <button class="btn btn-sm btn-info" @click="setGameVersion('30')">
            30 min
          </button>
          <button class="btn btn-sm btn-info" @click="setGameVersion('60')">
            60 min
          </button>
        </div>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <p class="text-muted mb-0">
          💡 Use the <strong>Debug</strong> button for any page to reduce hint timer from 5 min to 10 sec
        </p>
      </div>
    </div>
  </div>
</template>
