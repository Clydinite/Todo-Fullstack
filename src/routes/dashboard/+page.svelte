<script lang="ts">
	import { auth, db } from '$lib/firebase/firebase';
	import Icon from '@iconify/svelte';
	import { authHandlers, authStore } from '../../store/store';
	import { getDoc, doc, setDoc } from 'firebase/firestore';

	let todoList = [] as string[];
	let currentTodo = '';

	authStore.subscribe((current) => {
		todoList = current.todos;
	});

	function addTodo() {
		if (!currentTodo) return;
		todoList = [...todoList, currentTodo];
		currentTodo = '';
	}

	function editTodo(index: number) {
		currentTodo = todoList[index];
		todoList = todoList.filter((_, i) => i !== index);
	}

	function deleteTodo(index: number) {
		todoList = todoList.filter((_, i) => i !== index);
	}

	async function saveTodos() {
		try {
			if (!$authStore.user) return;

			const userRef = doc(db, 'users', $authStore.user.uid);
			await setDoc(userRef, { todos: todoList }, { merge: true });
		} catch (err) {
			console.log("There's a save error", err);
		}
	}
</script>

<div class="main-container">
	<div class="header-container">
		<h1>Todo List</h1>
		<div class="header-buttons">
			<button
				on:click={() => {
					saveTodos();
					console.log('saving', $authStore);
				}}><Icon icon="material-symbols:save" />Save</button
			>
			<button on:click={authHandlers.logout}><Icon icon="material-symbols:logout" />Logout</button>
		</div>
	</div>

	<main>
		{#each todoList as todo, index}
			<div class="todo">
				<div>
					<p>{index + 1}</p>
					<p>{todo}</p>
				</div>

				<div class="actions">
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- edit icon -->
					<svg
						on:click={() => {
							editTodo(index);
							console.log('test');
						}}
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						{...$$props}
					>
						<path
							fill="currentColor"
							d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-2 2v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
						/>
					</svg>

					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- delete icon -->
					<svg
						on:click={() => deleteTodo(index)}
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 256 256"
						{...$$props}
					>
						<path
							fill="currentColor"
							d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
						/>
					</svg>
				</div>
			</div>
		{/each}
	</main>

	<div class="enter-todo">
		<input bind:value={currentTodo} type="text" name="" id="" placeholder="Enter Todo" />
		<button on:click={addTodo}>Add Todo</button>
	</div>
</div>

<style>
	h1 {
		font-size: 2rem;
	}

	.main-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		gap: 1rem;
		padding: 1rem;
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}

	.main-container button {
		background: rgb(91, 159, 255);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer; /* changes the cursor to a pointer (hand) when hovering over the button */
		font-size: 0.8rem;
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.header-container button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
		font-weight: bold;
	}

	.header-container button:hover {
		opacity: 0.8;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1; /* this will make the container take up the full height of the viewport */
	}

	.todo {
		display: flex;
		align-items: center;
		justify-content: space-between; /* horizontally */
		border-left: 3px solid rgb(91, 159, 255);
		padding: 0.5rem;
	}

	.todo div {
		display: flex;
		gap: 0.75rem;
	}

	.todo div p:first-of-type {
		background: rgb(91, 159, 255);
		width: 2rem;
		text-align: center;
		border-radius: 0.5rem;
	}

	.actions {
		font-size: 1.4rem;
	}

	.actions svg:hover {
		cursor: pointer;
		color: coral;
		transition-duration: 0.05s;
		transition-timing-function: ease;
	}

	.enter-todo {
		display: flex;
		align-items: stretch;
		gap: 1rem;
	}

	.enter-todo input {
		background: transparent;
		border: none;
		padding: 0.5rem;
		flex: 1;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.8rem;
		border: 3px solid rgb(6, 6, 78);
		border-radius: 0.5rem;
	}

	.enter-todo input:focus {
		outline: none;
	}

	.enter-todo input:focus-within {
		border: 3px solid rgb(91, 159, 255);
	}

	.enter-todo button {
		background: rgb(6, 6, 78);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer; /* changes the cursor to a pointer (hand) when hovering over the button */
		font-size: 0.8rem;
	}

	.enter-todo button:hover {
		background: rgb(91, 159, 255);
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 1.5rem;
			text-wrap: nowrap;
		}

		.header-buttons button,
		.enter-todo button {
			font-size: 0.8rem;
			text-wrap: nowrap;
		}
	}
</style>
