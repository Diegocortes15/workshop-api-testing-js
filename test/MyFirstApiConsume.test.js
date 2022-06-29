const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const urlBase = 'https://httpbin.org';

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await axios.get(`${urlBase}/ip`);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await axios.get(`${urlBase}/get`, { query });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.config.query).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await axios.head(`${urlBase}/headers`);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.be.empty;
  });

  it('Consume PATCH Service', async () => {
    const userData = {
      name: 'Diego Alejandro',
      surname: 'Cortes Roa',
      career: 'Multimedia Engineer'
    };

    const response = await axios.patch(`${urlBase}/patch`, userData);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(JSON.parse(response.data.data)).to.eql(userData);
  });

  it('Consume PUT Service', async () => {
    const body = {
      name: 'Diego Alejandro',
      surname: 'Cortes Roa',
      career: 'Multimedia Engineer'
    };

    const response = await axios.put(`${urlBase}/put`, body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(body);
  });

  it('Consume DELETE Service', async () => {
    const response = await axios.delete(`${urlBase}/delete`);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.data).to.be.empty;
  });
});
