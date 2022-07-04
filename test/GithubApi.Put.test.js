const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const followUser = axios.create({
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

const user = 'Diegocortes15';
const userToFollow = 'aperdomob';

const indempotent = {
  followUser: {}
};

describe('Consume PUT methods', () => {
  it(`Should follow the user ${userToFollow}`, async () => {
    const response = await followUser.put(
      `https://api.github.com/user/following/${userToFollow}`
    );

    indempotent.followUser.data = response.data;
    indempotent.followUser.status = response.status;

    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.be.empty;
  });

  it(`Should be following the user ${userToFollow}`, async () => {
    const response = await axios.get(
      `https://api.github.com/users/${user}/following`
    );

    const expectedUser = response.data.find(
      ({ login }) => login === userToFollow
    );

    expect(response.status).to.equal(StatusCodes.OK);
    expect(expectedUser.login).to.equal(userToFollow);
  });

  it('Verify indempotent to follow a user', async () => {
    const response = await followUser.put(
      `https://api.github.com/user/following/${userToFollow}`
    );

    expect(response.status).to.equal(indempotent.followUser.status);
    expect(response.data).to.equal(indempotent.followUser.data);
  });
});
