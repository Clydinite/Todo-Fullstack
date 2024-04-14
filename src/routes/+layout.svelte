<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase/firebase';
	import { getDoc, doc, setDoc } from 'firebase/firestore';
	import { authStore } from '../store/store';

	const publicRoutes = ['/'];

	onMount(() => {
		console.log('mounted');

		// this function is called when it's unmounted
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;

			if (!user && !publicRoutes.includes(currentPath)) {
				window.location.href = '/';
				return;
			}

			if (!user) {
				return;
			}

			if (user && currentPath === '/') {
				window.location.href = '/dashboard';
				return;
			}

			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			let dataToSetToStore: {
				email: string;
				todos: string[];
			};

			if (!docSnap.exists()) {
				console.log('creating user');
				const userRef = doc(db, 'users', user.uid);
				dataToSetToStore = {
					email: user.email!,
					todos: []
				};

				await setDoc(userRef, dataToSetToStore, { merge: true });
			} else {
				console.log('fetching user');
				const userData = docSnap.data();
				dataToSetToStore = userData as {
                    email: string;
                    todos: string[]
                };
			}

			authStore.update((current) => {
				return {
                    ...current,
                    user: user,
					...dataToSetToStore
				};
			});
		});
		return unsubscribe;
	});
</script>

<div class="main-container">
	<slot></slot>
</div>

<style>
	.main-container {
		min-height: 100vh;
		background: linear-gradient(to right, #000428, #000046);
		color: white;
		position: relative;
		display: flex;
		flex-direction: column;
	}
</style>
