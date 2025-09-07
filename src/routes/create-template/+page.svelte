<script lang="ts">
    import { goto } from "$app/navigation";
    import GenaiFile from "$lib/components/GenaiFile.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { ImageData } from "$lib/types";

    let urls: ImageData[] | null = $state(null);
    let files: FileList | null = $state(null);
    let loading = $state(false);

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

<h1 class="text-2xl font-bold mb-4">Create Template</h1>

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

<Button
    disabled={!(!loading && urls?.length)}
    onclick={() => createTemplate(urls!)}>Trace art style</Button
>
