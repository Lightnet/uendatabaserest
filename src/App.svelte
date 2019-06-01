<script>
//https://svelte.dev/docs#setContext
//https://svelte.dev/examples#reactive-statements

	import { onMount, setContext } from 'svelte'
	import Home from './component/home.svelte'
	import News from './component/news.svelte'
	import Account from './component/account.svelte'
	import Login from './component/login.svelte'

	import Character from './component/character.svelte'
	import Creatures from './component/creatures.svelte'

	import Inventory from './component/inventory.svelte'
	import Equips from './component/equips.svelte'
	import Skills from './component/skills.svelte'

	import Map from './component/map.svelte'
	
	import Shop from './component/shop.svelte'

	import Server from './component/server.svelte'
	import Admin from './component/admin.svelte'

	export let name;

	let blogin = false;
	let view = "account";


	let count = 0;

	function handleview(_view){
		view = _view;
		console.log(_view);
	}

	function logouthandle(){
		blogin = false;
	}

	function handleClick() {
		count += 1;
	}

	onMount(async () => {
		console.log("onMount");
		//const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		//photos = await res.json();
	});

	function handle_logincheck(event){
		console.log(event.detail.text);
		if(event.detail.text == 'login'){
			blogin = true;
		}
	}
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<div>App {name}!</div>
<div>
	<a href="/#" on:click={()=>{handleview('home')}}>Home</a>
	<a href="/#" on:click={()=>{handleview('news')}}>News</a>
	<a href="/#" on:click={()=>{handleview('account')}}>Account</a>

	<a href="/#" on:click={()=>{handleview('character')}}>Character</a>
	<a href="/#" on:click={()=>{handleview('creatures')}}>Creatures</a>

	<a href="/#" on:click={()=>{handleview('inventory')}}>Inventory</a>
	<a href="/#" on:click={()=>{handleview('equips')}}>Equips</a>
	<a href="/#" on:click={()=>{handleview('skills')}}>Skills</a>
	
	<a href="/#" on:click={()=>{handleview('shop')}}>Shop</a>
	<a href="/#" on:click={()=>{handleview('map')}}>Map</a>

	<a href="/#" on:click={()=>{handleview('server')}}>Server</a>
	<a href="/#" on:click={()=>{handleview('admin')}}>Admin</a>

	{#if blogin === true}
		<a href="/#" on:click={logouthandle}>Logout</a>
	{/if}
</div>

{#if blogin === true}
	{#if view == "account"}
		<Account></Account>
	{:else if view == 'home'}	
		<Home></Home>
	{:else if view == 'news'}	
		<News></News>
	{:else if view == 'character'}	
		<Character></Character>
	{:else if view == 'creatures'}	
		<Creatures></Creatures>
	{:else if view == 'inventory'}	
		<Inventory></Inventory>
	{:else if view == 'equips'}	
		<Equips></Equips>
	{:else if view == 'Skills'}	
		<Skills></Skills>
	{:else if view == 'map'}	
		<Map></Map>
	{:else if view == 'shop'}	
		<Shop></Shop>
	{:else if view == 'server'}	
		<Server></Server>
	{:else if view == 'admin'}	
		<Admin></Admin>
	{:else}	
		<Home />
	{/if}

{:else}
	<Login on:message={handle_logincheck}/>
{/if}





<!--
<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
-->