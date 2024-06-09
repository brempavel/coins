import axios, { AxiosError } from 'axios';

const baseUrl = 'https://api-eu.okotoki.com';

export const getCoins = async () => {
	let response;
	try {
		response = await axios.get(`${baseUrl}/coins`);
	} catch (e: unknown) {
		response = (e as AxiosError).response;
	}

	return response?.data;
};
