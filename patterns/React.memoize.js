function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
	const hook = updateWorkInProgressHook();
	const nextDeps = deps === undefined ? null : deps;
	const prevState = hook.memoizedState;
	if (prevState !== null) {
		if (nextDeps !== null) {
			const prevDeps: Array<mixed> | null = prevState[1];
			if (areHookInputsEqual(nextDeps, prevDeps)) {
				return prevState[0];
			}
		}
	}
	hook.memoizedState = [callback, nextDeps];
	return callback;
}

function updateMemo<T>(nextCreate: () => T, deps: Array<mixed> | void | null): T {
	const hook = updateWorkInProgressHook();
	const nextDeps = deps === undefined ? null : deps;
	const prevState = hook.memoizedState;
	if (prevState !== null) {
		// Assume these are defined. If they're not, areHookInputsEqual will warn.
		if (nextDeps !== null) {
			const prevDeps: Array<mixed> | null = prevState[1];
			if (areHookInputsEqual(nextDeps, prevDeps)) {
				return prevState[0];
			}
		}
	}
	const nextValue = nextCreate(); // <--!!
	hook.memoizedState = [nextValue, nextDeps];
	return nextValue;
}
