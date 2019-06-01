<script>
//https://svelte.dev/docs#setContext
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let input_username = "test";
    let input_password = "testa";

    async function getLoginAsync(data) {
        //let response = await fetch(`http://localhost:8080/ue4/login?username=${input_username}`);
        //let data = await response.json()
        //return data;

        let rawResponse = await fetch('http://localhost:8080/ue4/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        let content = await rawResponse.json();
        console.log(content);
    }

    async function getRegisterAsync(data) {
        let rawResponse = await fetch('http://localhost:8080/ue4/register', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        let content = await rawResponse.json();
        console.log(content);
    }

    function action_login(){
        dispatch('message', {text: 'login'});
        getLoginAsync({
            username:input_username,
            password:input_password
        });
    }

    function action_register(){
        //dispatch('message', {text: 'login'});
        getRegisterAsync({
            username:input_username,
            password:input_password
        });
        //console.log("register");

        
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
        <button on:click={action_register}>Register</button>
    </div>
</section>