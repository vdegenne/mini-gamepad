export function sleep(timeoutMs: number) {
	return new Promise((r) => setTimeout(r, timeoutMs));
}

export function isDev() {
	try {
		return import.meta.env.DEV;
	} catch {
		return false;
	}
}
