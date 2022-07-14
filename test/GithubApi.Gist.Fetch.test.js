const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
require('isomorphic-fetch');

const headers = {
  Authorization: `token ${process.env.ACCESS_TOKEN}`
};

const baseUrl = 'https://api.github.com';

describe('FETCH - Consume DELETE method and non-existing resource', () => {
  const gistBody = {
    description: 'Example of a gist',
    public: false,
    files: {
      'README.md': {
        content: 'Hello World by Diegocortes15'
      }
    }
  };

  let response;
  let data;

  before(async () => {
    response = await fetch(`${baseUrl}/gists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(gistBody)
    });
  });

  it('Should create a gist and must be verifying its data', async () => {
    expect(response.status).to.equal(StatusCodes.CREATED);

    data = await response.json();

    expect(data).to.containSubset(gistBody);
  });

  it('Should return the previous gist created', async () => {
    response = await fetch(data.url, {
      method: 'GET',
      headers
    });

    expect(response.status).to.equal(StatusCodes.OK);

    data = await response.json();

    expect(data.url).to.equal(data.url);
  });

  it('Should delete the gist created', async () => {
    response = await fetch(data.url, {
      method: 'DELETE',
      headers
    });
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
  });

  it('Should verify that the gist created has been deleted', async () => {
    response = await fetch(data.url, {
      method: 'GET',
      headers
    });
    expect(response.status).to.equal(StatusCodes.NOT_FOUND);
  });
});
