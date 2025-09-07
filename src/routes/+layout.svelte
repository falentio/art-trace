<script lang="ts">
  import "@fontsource-variable/outfit";
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-dvh flex flex-col p-4 max-w-3xl w-full mx-auto">
  {@render children?.()}
</div>
