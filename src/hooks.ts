import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	if (url.host === 'api.logmaxing.tech') {
		return `/api${url.pathname}`;
	}
};
