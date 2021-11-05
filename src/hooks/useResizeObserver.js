const toRect = (rect) => {
    const { width = 0, height = 0, x = 0, y = 0 } = rect || {};
    return { width, height, x, y };
};

const useResizeObserver = (ref) => {
    const [rect, setRect] = useState(
        toRect(ref.current?.getBoundingClientRect())
    );

    useeffect(() => {
        const ob = new ResizeObserver(() =>
            setRect(toRect(ref.current?.getBoundingClientRect()))
        );

        ob.observe(ref.current);

        return () => ob.disconnet();
    }, [ref]);

    return rect;
};

export default useResizeObserver;
