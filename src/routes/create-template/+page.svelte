<script lang="ts">
    import { goto } from "$app/navigation";
    import GenaiFile from "$lib/components/GenaiFile.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { ImageData } from "$lib/types";
    import { between } from "drizzle-orm";
    import { resource } from "runed";

    let urls: ImageData[] | null = $state(null);
    let files: FileList | null = $state(null);
    let loading = $state(false);
    let rss = resource(
        () => [] as ImageData[] | null,
        async () => createTemplate(urls!),
        { lazy: true },
    );

    async function createTemplate(images: ImageData[]) {
        const res = await fetch("/create-template", {
            method: "POST",
            body: JSON.stringify(images),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { id } = await res.json();
        goto(`/template/${id}`);
    }
</script>

<div class="mb-4">
    <h1 class="text-2xl font-bold">Create Template</h1>
    <span class="text-muted-foreground">
        Upload your images that represent the art styles you want to trace, you
        can upload multiple images. Upload between 5 to 10 images for maximum
        result
    </span>
</div>

<GenaiFile bind:urls bind:files bind:loading />

<div class="flex flex-col gap-4 py-2">
    {#if loading}
        <p>Uploading files...</p>
    {:else if files}
        <h2 class="font-semibold">Uploaded URLs</h2>
        <div class="grid grid-cols-3 gap-2">
            {#each [...files] as file (file.name)}
                <div
                    class="aspect-square overflow-hidden rounded-md border w-full"
                >
                    <div class="size-full">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded "
                            class="max-w-full object-cover"
                        />
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p>No files uploaded yet.</p>
    {/if}
</div>
{#if rss.loading}
    <div>Creating template...</div>
{/if}

<Button disabled={rss.loading || !urls?.length} onclick={() => rss.refetch()}
    >Trace art style</Button
>
