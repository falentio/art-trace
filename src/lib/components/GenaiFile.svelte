<script lang="ts">
	import { cn } from "$lib/utils";
	import { resource } from "runed";
	import { untrack } from "svelte";

	let {
		urls = $bindable<{ uri: string; mimeType: string }[] | null>(null),
		files = $bindable<FileList | null>(null),
		loading = $bindable(false),
	} = $props();

	const rss = resource(
		() => files,
		() => uploadFiles(),
		{ lazy: true },
	);

	$effect(() => {
		urls =
			(rss.current as { uri: string; mimeType: string }[] | undefined) ??
			null;
		loading = rss.loading;
	});
	$effect(() => {
		untrack(() => {
			urls = [];
		});
		files;
	});

	async function uploadFiles() {
		if (!files || files.length === 0) {
			return;
		}
		const form = new FormData();
		for (const file of files) {
			form.append("files", file);
		}
		const res = await fetch("/api/upload", {
			method: "POST",
			body: form,
		});
		const data = await res.json();
		if (!data.success) {
			console.error("Upload failed:", data.issues);
		}
		return data.urls as { uri: string; mimeType: string }[];
	}
</script>

<h2 class="text-xl font-bold">Upload Images</h2>
<label
	class={cn(
		"selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground shadow-xs flex w-full min-w-0 rounded-md border bg-transparent text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
		"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
		"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
		"w-fit  flex flex-row gap-2 p-4 items-center",
	)}
>
	<input
		class="hidden"
		type="file"
		onchange={(e) => (files = e.currentTarget.files)}
		multiple
		accept="image/*"
	/>
	<div class="size-8 block">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="size-full block"
			viewBox="0 0 24 24"
			><!-- Icon from Huge Icons by Hugeicons - undefined --><g
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				color="currentColor"
				><path
					d="M13 3.002Q12.295 3 11.5 3C7.022 3 4.782 3 3.391 4.391S2 8.021 2 12.5c0 4.478 0 6.718 1.391 8.109S7.021 22 11.5 22c4.478 0 6.718 0 8.109-1.391c1.338-1.339 1.389-3.462 1.39-7.609"
				/><path
					d="M2 14.135q.93-.135 1.872-.132c2.652-.056 5.239.77 7.3 2.331c1.91 1.448 3.253 3.44 3.828 5.666"
				/><path
					d="M21 16.896c-1.175-.595-2.391-.897-3.614-.896c-1.851-.007-3.684.673-5.386 2m5-13.5c.491-.506 1.8-2.5 2.5-2.5M22 4.5c-.491-.506-1.8-2.5-2.5-2.5m0 0v8"
				/></g
			></svg
		>
	</div>
	<div>Choose images to Trace the art styles</div>
</label>
