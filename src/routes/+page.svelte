<script lang="ts">
  import GenaiFile from "$lib/components/GenaiFile.svelte";
  import ResultContainer from "$lib/components/ResultContainer.svelte";
  import ResultImage from "$lib/components/ResultImage.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<div>
  <h1 class="text-2xl font-bold">Art Tracer</h1>
  <span class="text-muted-foreground"
    >You saw beautiful art styles, and want to re-use it using AI? this app is
    for you, you can create copy of that art styles for your social media,
    e-commerce, promotions, mascots, poster, and much more.</span
  >
</div>

<div class="flex flex-col gap-4 mt-8">
  <div
    class="p-4 bg-card flex flex-col text-card-foreground border rounded-lg shadow-sm"
  >
    <Button href="/create-template" class="w-full">Create New Template</Button>
  </div>
  {#each data.templtates as { template, generated } (template.id)}
    <div class="p-4 bg-card text-card-foreground border rounded-lg shadow-sm">
      <h2 class="text-lg font-bold">{template.title}</h2>
      <p class="text-muted-foreground">{template.description}</p>
      <ResultContainer>
        {#each generated.slice(0, 4) as img (img.id)}
          <ResultImage withDownload={false} id={img.id}></ResultImage>
        {/each}
      </ResultContainer>
      <div class="flex justify-end">
        <Button href="/template/{template.id}">Redraw My Picture</Button>
      </div>
    </div>
  {/each}
</div>
