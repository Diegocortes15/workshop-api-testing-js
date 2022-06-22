const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

axios.interceptors.request.use((request) => {
	const headers = {
		...request.headers.common,
		...request.headers[request.method],
		...request.headers,
	};

	// remove unrelevant headers to reduce the noise
	['common', 'get', 'post', 'head', 'put', 'patch', 'delete'].forEach(
		(header) => {
			delete headers[header];
		}
	);

	const printable = `
---------------------------------------------- \n
REQUEST ⏩ \n
${new Date()}
Request: ${request.method.toUpperCase()}
URL:${request.url}
Headers: ${JSON.stringify(headers, null, 2)} \n
Data: ${
		request.data ? JSON.stringify(response.data, null, 2) : 'There is no data'
	}
	`;

	console.log(printable);
	return request;
});

axios.interceptors.response.use((response) => {
	const printable = `
⏩ RESPONSE \n
${new Date()}
Status: ${response.status} ${response.statusText}
Headers: ${JSON.stringify(response.headers, null, 2)} \n
Data: ${
		response.data ? JSON.stringify(response.data, null, 2) : 'There is no data'
	}
`;

	console.log(printable);
	return response;
});

describe('First Api Tests', () => {
	it('Consume GET Service', async () => {
		const response = await axios.get('https://httpbin.org/ip');

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.data).to.have.property('origin');
	});

	it('Consume GET Service with query parameters', async () => {
		const query = {
			name: 'John',
			age: '31',
			city: 'New York',
		};

		const response = await axios.get('https://httpbin.org/get', { query });

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.query).to.eql(query);
	});

	it('Consume HEAD Service', async () => {
		const response = await axios.get('https://httpbin.org/headers');

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.data).to.have.property('headers');
	});

	it('Consume PATCH Service', async () => {
		const response = await axios.patch('https://httpbin.org/patch');

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.url).to.have.string('/patch');
	});

	it('Consume PUT Service', async () => {
		const response = await axios.put('https://httpbin.org/put');

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.url).to.have.string('/put');
	});

	it('Consume DELETE Service', async () => {
		const response = await axios.delete('https://httpbin.org/delete');

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.url).to.have.string('/delete');
	});
});
