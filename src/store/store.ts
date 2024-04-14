import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	type User
} from 'firebase/auth';
import { writable, type Writable } from 'svelte/store';
import { auth } from '$lib/firebase/firebase.js';

export const authStore: Writable<{
	user: User | null;
	loading: boolean;
	todos: string[];
}> = writable({
	user: null,
	loading: true,
	todos: []
});

export const authHandlers = {
	signup: async (email: string, password: string) => {
		await createUserWithEmailAndPassword(auth, email, password);
	},

	login: async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
	},

	logout: async () => {
		await signOut(auth);
	}
};
