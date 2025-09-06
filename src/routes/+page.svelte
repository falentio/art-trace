<script lang="ts">
import GenaiFile from "$lib/components/GenaiFile.svelte";
// Bindable urls coming from GenaiFile's internal resource
let urls: string[] | null = $state(null);

$inspect(urls);
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read
  the documentation
</p>

<GenaiFile bind:urls />

{#if urls?.length}
  <div class="mt-4 space-y-2">
    <h2 class="font-semibold">Uploaded URLs</h2>
    <ul class="list-disc list-inside text-sm break-all">
      {#each urls as url}
        <li>{url}</li>
      {/each}
    </ul>
  </div>
{/if}
