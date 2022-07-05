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

    expect(response.status).to.equal(StatusCodes.NO_CONTENT);
    expect(response.data).to.be.empty;

    indempotent.followUser.data = response.data;
  });

  it(`Should be following the user ${userToFollow}`, async () => {
    const response = await axios.get(
      `https://api.github.com/users/${user}/following`
    );

    expect(response.status).to.equal(StatusCodes.OK);

    const expectedUser = response.data.find(
      ({ login }) => login === userToFollow
    );

    expect(expectedUser.login).to.equal(userToFollow);

    indempotent.userFollowed = expectedUser.login;
  });

  it('Verify indempotent to follow a user', async () => {
    const responseFollowUser = await followUser.put(
      `https://api.github.com/user/following/${userToFollow}`
    );

    expect(responseFollowUser.status).to.equal(StatusCodes.NO_CONTENT);
    expect(responseFollowUser.data).to.equal(indempotent.followUser.data);

    const responseFollowedUsers = await axios.get(
      `https://api.github.com/users/${user}/following`
    );

    expect(responseFollowedUsers.status).to.equal(StatusCodes.OK);

    const expectedUser = responseFollowedUsers.data.find(
      ({ login }) => login === userToFollow
    );

    expect(expectedUser.login).to.equal(indempotent.userFollowed);
  });
});
