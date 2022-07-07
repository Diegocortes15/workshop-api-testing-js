const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const instance = axios.create({
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

const baseUrl = 'https://api.github.com';
const githubUsersUrl = `${baseUrl}/users`;

describe('Query parameters to get with GET request', () => {
  it('Verify how many users have by default', async () => {
    const defaultNumberUsers = 30;

    const response = await instance.get(githubUsersUrl);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.length).to.equal(defaultNumberUsers);
  });

  it('Should return 10 users', async () => {
    const params = {
      per_page: 10
    };

    const response = await instance.get(githubUsersUrl, {
      params
    });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.length).to.equal(params.per_page);
  });

  it('Should return 100 users', async () => {
    const params = {
      per_page: 100
    };

    const response = await instance.get(githubUsersUrl, {
      params
    });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.length).to.equal(params.per_page);
  });
});
