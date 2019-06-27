<script>
//https://svelte.dev/docs#setContext
//https://svelte.dev/examples#reactive-statements

	import { onMount, setContext } from 'svelte'

	import Modal from './component/basic/modalcomponent.svelte';

	import Home from './component/basic/homecomponent.svelte'
	import News from './component/basic/newscomponent.svelte'
	import Account from './component/account/accountcomponent.svelte'
	import Login from './component/account/logincomponent.svelte'
	import Character from './component/rpg/charactercomponent.svelte'
	import Creatures from './component/rpg/creaturescomponent.svelte'
	import Map from './component/rpg/mapcomponent.svelte'
	import Shop from './component/rpg/shopcomponent.svelte'
	import Server from './component/admin/servercomponent.svelte'
	import Admin from './component/admin/admincomponent.svelte'
	
	import { count, UserName, SessionHash } from './stores.js';

	export let name;

	let showModal = false;
	let blogin = false;
	let view = "account";
	let msgmodal = "None";
	//let sessionhash = "";

	let count_value;

	const unsubscribe = count.subscribe(value => {
		count_value = value;
	});

	function handleview(_view){
		view = _view;
		console.log(_view);
	}

	function logouthandle(){
		blogin = false;
		SessionHash.set('');
		UserName.set('Guest');
	}

	onMount(async () => {
		console.log("onMount");
		//const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		//photos = await res.json();
	});

	function showmodal(msg){
		showModal = true;
		msgmodal = msg;
	}

	function handle_msg(event){
		if(event.detail.msg){
			console.log("event.detail.message:"+event.detail.msg);
			//register
			if(event.detail.msg == 'userexist'){
				showmodal('User Exist!');
			}
			if(event.detail.msg == 'usercreated'){
				showmodal('User Created!');
			}
		}

		//login
		if(event.detail.message){
			if(event.detail.message == 'passwordpass'){
				showmodal('Login Pass!');
				blogin = true;
				//sessionhash = event.detail.sessionhash;
				view = "account";
				//console.log(sessionhash);
			}

			if(event.detail.message == 'passwordfail'){
				showmodal('Login Fail!');
			}

			if(event.detail.message == 'donotexist'){
				showmodal("User Doesn't Exist!");
			}
		}
	}
</script>

<style>
	/*
	h1 {
		color: purple;
	}
	*/
</style>
<!--
<h1>The count is {$count}</h1>
<button on:click={count.increment}>+</button>
<button on:click={count.decrement}>-</button>
<button on:click={count.reset}>reset</button>
-->

<div> {name} Rest App.</div>
<div>
	<a href="/#" on:click={()=>{handleview('home')}}>Home</a>
	<a href="/#" on:click={()=>{handleview('news')}}>News</a>
	<a href="/#" on:click={()=>{handleview('account')}}>Account</a>

	<a href="/#" on:click={()=>{handleview('character')}}>Character</a>
	<a href="/#" on:click={()=>{handleview('creatures')}}>Creatures</a>

	<a href="/#" on:click={()=>{handleview('shop')}}>Shop</a>
	<a href="/#" on:click={()=>{handleview('map')}}>Map</a>

	<a href="/#" on:click={()=>{handleview('server')}}>Server</a>
	<a href="/#" on:click={()=>{handleview('admin')}}>Admin</a>

	{#if blogin === true}
		<a href="/#" on:click={logouthandle}>Logout</a>
	{:else}
		<a href="/#" on:click={()=>{handleview('login')}}>Login</a>
	{/if}

</div>

{#if blogin === true}
	{#if view == "account"}
		<Account />
	{:else if view == 'home'}	
		<Home />
	{:else if view == 'news'}	
		<News />
	{:else if view == 'character'}	
		<Character />
	{:else if view == 'creatures'}	
		<Creatures />
	{:else if view == 'map'}	
		<Map />
	{:else if view == 'shop'}	
		<Shop />
	{:else if view == 'server'}	
		<Server />
	{:else if view == 'admin'}	
		<Admin />
	{:else if view == 'login'}	
		<Login on:message={handle_msg}/>
	{:else}	
		<Home />
	{/if}
{:else}
	{#if view == 'login'}	
		<Login on:message={handle_msg}/>
	{:else if view == 'news'}	
		<News />
	{:else}	
		<Home />
	{/if}	
	<!--
	<Login on:message={handle_msg}/>
	-->
{/if}


<!--
Test
<button on:click="{() => showModal = true}">
	show modal
</button>
-->

{#if showModal}
	<Modal on:close="{() => showModal = false}">
		<h2 slot="header">
			Message
		</h2>
		<p>{msgmodal}</p>
	</Modal>
{/if}

<!--
<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
-->