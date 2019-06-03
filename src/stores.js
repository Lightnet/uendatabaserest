import { writable } from 'svelte/store';

function createCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update(n => n + 1),
		decrement: () => update(n => n - 1),
		reset: () => set(0)
	};
}

export const count = createCount();

export const UserName = writable('Guest');
export const CharacterName = writable('None');
export const SessionHash = writable('');
export const AccessLevel = writable('None');

//export const sessionsalt = writable(0);
//export const hashkey = writable(0);


