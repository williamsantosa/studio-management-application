import "carbon-components-svelte/css/all.css";

<script>
    let theme = $state("g100"); // "white" | "g10" | "g80" | "g90" | "g100"

    $effect(() => {
        document.documentElement.setAttribute("theme", theme);
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
