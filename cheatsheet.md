 * https://svelte.dev/examples#component-events
 * https://svelte.dev/tutorial/actions

{#if true}
    statement
    {:else}
    {#each products as product}
        < product.name>
    {/each} 
{/if}

