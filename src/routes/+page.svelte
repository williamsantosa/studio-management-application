<script lang="ts">
    // Assuming this component is part of an app where Carbon CSS is loaded globally
    // import 'carbon-components-svelte/css/all.css'; // Usually in +layout.svelte

    // Example: If you want to place it within a Carbon grid
	import { Grid, Row, Column } from 'carbon-components-svelte';

    // --- Image Details ---
    // Replace with the actual filename of your image within static/images/
    const imageName = "KoosMartialArts.webp";
    // IMPORTANT: Provide a meaningful description for accessibility
    const imageAltText = "A descriptive caption for the image";

    // Construct the public path
    const imageSrc = `/images/${imageName}`;
    // --------------

</script>

<Grid fullWidth>
    <Row>
        <Column/>
        <Column>
            <h1>Image from Static Folder</h1>
            <img
                src={imageSrc}
                alt={imageAltText}
                style="max-width: 100%; height: auto; display: block; margin-top: 1rem;"
                width="400"
                height="300"
             />

             <p>Some text following the image.</p>
        </Column>
        <Column/>
    </Row>
</Grid>