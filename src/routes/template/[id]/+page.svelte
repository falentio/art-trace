<script lang="ts">
    import GenaiFile from "$lib/components/GenaiFile.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { ImageData } from "$lib/types";
    import { resource } from "runed";
    import type { PageData, PageProps } from "./$types";
    import ResultImage from "$lib/components/ResultImage.svelte";
    import ResultContainer from "$lib/components/ResultContainer.svelte";
    import { redirect } from "@sveltejs/kit";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    let { data }: PageProps = $props();

    let urls: ImageData[] | null = $state(null);
    let files: FileList | null = $state(null);
    let loading = $state(false);
    let result = $state(null as string | null);
    async function handleRedraw(data: ImageData) {
        if (!urls?.length) return;
        const res = await fetch("", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { id } = await res.json();
        return id as string;
    }

    const rss = $derived.by(() => {
        return urls?.map(handleRedraw);
    });
</script>

<div class="gap-2 flex flex-col mb-4">
    <h1 class="text-2xl font-bold">{data.template.title}</h1>
    <span class="text-muted-foreground">{data.template.description}</span>
</div>
<div class="flex flex-col gap-2 mb-4">
    <GenaiFile bind:files bind:urls bind:loading></GenaiFile>
    <div class="flex flex-col gap-4 py-2">
        {#if rss?.length}
            <ResultContainer>
                {#each rss as id (id)}
                    <ResultImage {id} />
                {/each}
            </ResultContainer>
        {:else if loading}
            <p>Uploading files...</p>
        {:else}
            <p>No files uploaded yet.</p>
        {/if}
    </div>
</div>

<h2 class="text-xl font-bold mb-2">Examples</h2>
{#if data.generated.length === 0}
    <p class="text-muted-foreground">No generated images yet.</p>
{:else}
    <ResultContainer>
        {#each data.generated as gen (gen.id)}
            <ResultImage
                id={gen.id}
                regenerate={() => {
                    const url = new URL("variations", page.url);
                    url.searchParams.set("id", gen.id);
                    url.searchParams.set("templateId", data.template.id);
                    goto(url);
                }}
            />
        {/each}
    </ResultContainer>
{/if}
<div></div>
