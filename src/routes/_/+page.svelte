<script>
    import { goto } from "$app/navigation";
</script>

<button onclick={() => fetch("/_", { method: "POST" })}>Test</button>
<button
    onclick={() =>
        fetch("/f", { method: "POST" })
            .then((r) => r.json())
            .then((r) => goto("/image/" + r.result))}>Tefasdst</button
>
