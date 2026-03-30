<script setup>
const error = useError()

function handleError() {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <NuxtLayout>
    <div class="m-auto prose">
      <h1>{{ error.statusCode }}</h1>
      <p>
        <strong>{{ error.message }}</strong>
      </p>
      <p>It looks like something broke.</p>
      <p>Sorry about that.</p>
      <p>
        Go back to your
        <a href="#" @click.prevent="handleError">
          Home.
        </a>
      </p>
    </div>
  </NuxtLayout>
</template>
