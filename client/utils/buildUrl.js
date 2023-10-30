export const buildUrl = (path) => {
	return import.meta.env.DEV
		? `http://localhost:4242/api${path}`
		: `https://railway.app/project/0921ef21-dcee-4779-a93d-00bb724c6eeb/service/236ec57f-9a5e-4d23-a9b7-295ac08c5486/api${path}`;
};
