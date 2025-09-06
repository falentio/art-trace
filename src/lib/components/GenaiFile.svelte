<script lang="ts">
import Input from "$lib/components/ui/input/input.svelte";
import { resource } from "runed";

// Bindable prop representing current uploaded URLs (rss.current)
let { urls = $bindable<{ uri: string; mimeType: string }[] | null>(null) } =
	$props();

let files: FileList | null = $state(null);

const rss = resource(
	() => files,
	() => uploadFiles(),
	{ lazy: true },
);

// Reflect resource current into bindable prop
$effect(() => {
	urls = (rss.current as { uri: string; mimeType: string }[] | undefined)
		?? null;
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

<Input
  type="file"
  onchange={(e) => (files = e.currentTarget.files)}
  multiple
  accept="image/*"
/>
