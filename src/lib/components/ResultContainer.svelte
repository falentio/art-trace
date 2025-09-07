<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet<[]>;
    }

    const { children }: Props = $props();
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
    {@render children()}
</div>
