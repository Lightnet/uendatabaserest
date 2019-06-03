 * https://svelte.dev/examples#component-events
 * https://svelte.dev/tutorial/actions

{#if true}
    statement
    {:else}
    {#each products as product}
        < product.name>
    {/each} 
{/if}


https://svelte.dev/docs
```javascript
<script>
	import { writable } from 'svelte/store';

	const count = writable(0);
	console.log($count); // logs 0

	count.set(1);
	console.log($count); // logs 1
</script>
```