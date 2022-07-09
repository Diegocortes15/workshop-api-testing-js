const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
require('isomorphic-fetch');

const headers = {
  Authorization: `token ${process.env.ACCESS_TOKEN}`
};

const baseUrl = 'https://api.github.com';
const gistCreated = {};

describe('Consume DELETE method and non-existing resource', () => {
  it('Should create a gist and must be verifying its data', async () => {
    const gistBody = {
      description: 'Example of a gist',
      public: false,
      files: {
        'README.md': {
          content: 'Hello World by Diegocortes15'
        }
      }
    };

    const response = await fetch(`${baseUrl}/gists`, {
      method: 'POST',
      headers,
      body: JSON.stringify(gistBody)
    });

    expect(response.status).to.equal(StatusCodes.CREATED);

    const data = await response.json();

    gistCreated.url = data.url;

    expect(data).to.containSubset(gistBody);
  });

  it('Should return the previous gist created', async () => {
    const response = await fetch(gistCreated.url, {
      method: 'GET',
      headers
    });

    expect(response.status).to.equal(StatusCodes.OK);

    const data = await response.json();

    expect(data.url).to.equal(gistCreated.url);
  });

  it('Should delete the gist created', async () => {
    const response = await fetch(gistCreated.url, {
      method: 'DELETE',
      headers
    });
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
  });

  it('Should verify that the gist created has been deleted', async () => {
    const response = await fetch(gistCreated.url, {
      method: 'GET',
      headers
    });
    expect(response.status).to.equal(StatusCodes.NOT_FOUND);
  });
});
