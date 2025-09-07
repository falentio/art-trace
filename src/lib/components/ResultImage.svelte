<script lang="ts">
    import { resource } from "runed";
    import Button from "./ui/button/button.svelte";
    import { Skeleton } from "./ui/skeleton";
    import { onDestroy } from "svelte";
    interface Props {
        id: string | Promise<string | undefined>;
        original?: ImageData;
        regenerate?: () => void;
        withDownload?: boolean;
    }

    const { id, original, regenerate, withDownload = true }: Props = $props();
    const rss = $derived(
        resource(
            () => id,
            async () => id,
        ),
    );
    let ms = $state(0);
    let intervalId: unknown;
    $inspect(rss.loading);
    $effect(() => {
        if (rss.loading) {
            intervalId = setInterval(() => {
                ms += 100;
            }, 100);
        } else {
            clearInterval(intervalId as number);
            ms = 0;
        }
    });

    onDestroy(() => {
        clearInterval(intervalId as number);
    });
</script>

<div class="flex flex-col gap-2">
    <div class="aspect-square overflow-hidden rounded-md border w-full">
        <div class="size-full relative">
            {#if !rss.loading}
                <img
                    src={`/image/${rss.current}`}
                    alt="Generated "
                    class="max-w-full object-cover"
                />
            {:else}
                <Skeleton class="size-full"></Skeleton>
                <div
                    class="absolute z-[99999] top-0 flex items-center justify-center size-full"
                >
                    <span
                        class=" p-2 bg-muted/10 text-muted-foreground rounded"
                    >
                        {(ms / 1000).toLocaleString("en-US", {
                            minimumFractionDigits: 1,
                        })}s
                    </span>
                </div>
            {/if}
        </div>
    </div>
    <div class="flex gap-2 justify-center">
        {#if regenerate}
            <Button size="icon" variant="outline" onclick={regenerate}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    ><!-- Icon from Huge Icons by Hugeicons - undefined --><path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="m15.167 1l.598 1.118c.404.755.606 1.133.472 1.295c-.133.162-.573.031-1.454-.23A9.8 9.8 0 0 0 12 2.78c-5.247 0-9.5 4.128-9.5 9.22a8.97 8.97 0 0 0 1.27 4.61M8.834 23l-.598-1.118c-.404-.756-.606-1.134-.472-1.295c.133-.162.573-.032 1.454.23c.88.261 1.815.402 2.783.402c5.247 0 9.5-4.128 9.5-9.22a8.97 8.97 0 0 0-1.27-4.609"
                        color="currentColor"
                    /></svg
                >
            </Button>
        {/if}
        {#if withDownload}
            <Button
                href="/image/{rss.current}"
                disabled={!rss.current || rss.loading}
                download
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    ><!-- Icon from Huge Icons by Hugeicons - undefined --><g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        color="currentColor"
                        ><path
                            d="M17 7.5c.491.506 1.8 2.5 2.5 2.5M22 7.5c-.491.506-1.8 2.5-2.5 2.5m0 0V2"
                        /><path
                            d="M21 13c-.002 4.147-.053 6.27-1.391 7.609C18.217 22 15.979 22 11.5 22c-4.478 0-6.718 0-8.109-1.391S2 16.979 2 12.5c0-4.478 0-6.718 1.391-8.109S7.021 3 11.5 3H14"
                        /><path
                            d="M2 14.135q.93-.135 1.872-.132c2.652-.056 5.239.77 7.3 2.331c1.91 1.448 3.253 3.44 3.828 5.666"
                        /><path
                            d="M21 16.896c-1.175-.595-2.391-.897-3.614-.896c-1.851-.007-3.684.673-5.386 2"
                        /></g
                    ></svg
                >
                <span>Download</span>
            </Button>
        {/if}
    </div>
</div>
