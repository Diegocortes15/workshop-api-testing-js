const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('First Api Tests', () => {
	it('Consume GET Service', async () => {
		const response = await axios.get('https://httpbin.org/ip').catch((error) => {
			console.log(error.toJSON());
		});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.data).to.have.property('origin');
	});

	it('Consume GET Service with query parameters', async () => {
		const query = {
			name: 'John',
			age: '31',
			city: 'New York',
		};

		const response = await axios
			.get('https://httpbin.org/get', { query })
			.catch((error) => {
				console.log(error.toJSON());
			});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.query).to.eql(query);
	});

	it('Consume HEAD Service', async () => {
		const response = await axios
			.head('https://httpbin.org/get')
			.catch((error) => {
				console.log(error.toJSON());
			});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.data).to.be.empty;
	});

	it('Consume HEAD Service', async () => {
		const response = await axios
			.head('https://httpbin.org/get')
			.catch((error) => {
				console.log(error.toJSON());
			});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.data).to.be.empty;
	});

	it('Consume PATCH Service', async () => {
		const response = await axios
			.patch('https://httpbin.org/patch')
			.catch((error) => {
				console.log(error.toJSON());
			});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.method).to.equal('patch');
	});

	it('Consume PUT Service', async () => {
		const response = await axios
			.put('https://httpbin.org/status/200')
			.catch((error) => {
				console.log(error.toJSON());
			});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.method).to.equal('put');
	});

	it('Consume DELETE Service', async () => {
		const response = await axios
			.delete('https://httpbin.org/status/200')
			.catch((error) => {
				console.log(error.toJSON());
			});

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.config.method).to.equal('delete');
	});
});
