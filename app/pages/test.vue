<!-- Test Page - List of all game pages -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later / Copyright (c) Orange SA -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

const pages = [
  { name: 'Welcome', path: '/', status: true },
  { name: 'Introduction', path: '/introduction', status: true },
  { name: 'Visual', path: '/visual', status: true },
  { name: 'Visual Simulation', path: '/visual-simulation', status: true },
  { name: 'Cognitive', path: '/cognitive', status: true },
  { name: 'Cognitive Simulation', path: '/cognitive-simulation', status: true },
  { name: 'Physical', path: '/physical', status: false },
  { name: 'Physical Simulation', path: '/physical-simulation', status: true },
  { name: 'Hearing', path: '/hearing', status: true },
  { name: 'Hearing Simulation', path: '/hearing-simulation', status: true },
  { name: 'Form Registration', path: '/form-registration', status: true },
  { name: 'Scores', path: '/scores', status: false },
]
</script>

<template>
  <div class="container my-5">
    <h1 class="mb-4">
      🧪 Test Page - Game Pages
    </h1>

    <div class="card">
      <div class="card-body">
        <h5 class="card-title">
          Available Game Pages
        </h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Action</th>
              <th>Path</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in pages" :key="page.path">
              <td>
                <NuxtLink :to="page.path" class="btn btn-sm btn-primary">
                  Go
                </NuxtLink>
              </td>
              <td><code>{{ page.path }}</code></td>
              <td>{{ page.name }}</td>
              <td>
                <span v-if="page.status === true" class="badge bg-success">✓ OK</span>
                <span v-else-if="page.status === false" class="badge bg-danger">✗ KO</span>
                <span v-else class="badge bg-secondary">?</span>
              </td>
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
        <p>You can also test specific game versions using query parameters:</p>
        <ul>
          <li>
            <NuxtLink to="?version=15" class="btn btn-sm btn-info">15 min version</NuxtLink>
          </li>
          <li>
            <NuxtLink to="?version=30" class="btn btn-sm btn-info">30 min version</NuxtLink>
          </li>
          <li>
            <NuxtLink to="?version=60" class="btn btn-sm btn-info">60 min version</NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card-body">
        <h5 class="card-title">
          Debug Mode
        </h5>
        <p>Add <code>?debug=true</code> to any game page to reduce hint timer from 5 min to 10 sec:</p>
        <ul>
          <li>
            <NuxtLink to="/form-registration?debug=true" class="btn btn-sm btn-warning">
              Form Registration (Debug)
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
