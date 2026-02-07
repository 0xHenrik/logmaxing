export function getAuthUserId(locals: App.Locals): number | null {
	return locals.apiKey?.userId ?? locals.userProfile?.id ?? null;
}
