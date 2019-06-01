<script>
//https://svelte.dev/docs#setContext
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();


    let input_username = "";
    let input_password = "";

    function action_login(){

        dispatch('message', {
			text: 'login'
		});
    }

</script>
<style>
</style>

<section>
    <div>
        <label>User Name</label>
        <input />
    </div>

    <div>
        <label>Password</label>
        <input />
    </div>

    <div>
        <button on:click={action_login}>Login</button>
        <button>Cancel</button>
        <button>Register</button>
    </div>
</section>