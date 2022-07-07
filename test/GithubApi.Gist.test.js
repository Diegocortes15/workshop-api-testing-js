const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');

const userInstance = axios.create({
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

const baseUrl = 'https://api.github.com';

const gistCreated = {};

describe.only('Consume DELETE method and non-existing resource', () => {
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

    const response = await userInstance.post(`${baseUrl}/gists`, gistBody);

    expect(response.status).to.equal(StatusCodes.CREATED);

    gistCreated.url = response.data.url;

    expect(response.data).to.containSubset(gistBody);
  });

  it('Should return the previous gist created', async () => {
    const response = await userInstance.get(gistCreated.url);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.url).to.equal(gistCreated.url);
  });

  it('Should delete the gist created', async () => {
    const response = await userInstance.delete(gistCreated.url);
    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
  });

  it('Should verify that the gist created has been deleted', async () => {
    await userInstance.get(gistCreated.url).catch((error) => {
      if (error.response) {
        expect(error.response.status).to.equal(StatusCodes.NOT_FOUND);
      }
    });
  });
});
