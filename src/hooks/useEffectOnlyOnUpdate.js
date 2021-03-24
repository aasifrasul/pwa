const useEffectOnlyOnUpdate = (callback, dependencies) => {
	const didMount = React.useRef(false);

	React.useEffect(() => {
		if (didMount.current) {
			callback(dependencies);
		} else {
			didMount.current = true;
		}
	}, [callback, dependencies]);
};

export default useEffectOnlyOnUpdate;
