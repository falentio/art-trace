<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ResultContainer from "$lib/components/ResultContainer.svelte";
    import ResultImage from "$lib/components/ResultImage.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { ImageData } from "$lib/types";
    import { resource } from "runed";

    async function handleRedraw(imageId: string) {
        const res = await fetch("", {
            method: "POST",
            body: JSON.stringify({
                uri: "https://art-trace.pages.dev/image/" + imageId,
                mimeType: "image/png",
            } as ImageData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const { id } = await res.json();
        return id as string;
    }

    const variations = $derived.by(() => {
        if (!browser) return [];
        return Array.from({ length: 4 }).map((_, i) =>
            handleRedraw(page.url.searchParams.get("id") || ""),
        );
    });
</script>

<div class="flex mb-2">
    <Button onclick={() => goto("..", { replaceState: true })}>Back</Button>
</div>

<div class="w-32 mx-auto">
    <ResultImage
        withDownload={false}
        id={page.url.searchParams.get("id") || ""}
    />
</div>

<div>
    <h1 class="text-2xl font-bold">Variations</h1>
</div>
<ResultContainer>
    {#each variations as v}
        <ResultImage id={v} />
    {/each}
</ResultContainer>
