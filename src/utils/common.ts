export const debounce = <T>(fn: (...args: T[]) => void, delay: number) => {
	let timer: number | undefined;
	return (...args: T[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};
