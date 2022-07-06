const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const userLogged = axios.create({
  headers: { Authorization: `token ${process.env.ACCESS_TOKEN}` }
});

const urlBase = 'https://api.github.com';
const githubUserName = 'Diegocortes15';
const repositoryName = 'FrontEndStore';

const userUrl = `${urlBase}/users/${githubUserName}`;

const issueCreated = {};

describe('Consume POST and PATCH methods', () => {
  it(`Verify that user ${githubUserName} has at least one repository`, async () => {
    const response = await userLogged.get(`${urlBase}/user`);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.public_repos).to.be.at.least(1);
  });

  it(`Verify that repository ${repositoryName} exist and won't be private`, async () => {
    const response = await userLogged.get(`${userUrl}/repos`);

    expect(response.status).to.equal(StatusCodes.OK);

    const { name: repoName, private: isPrivate } = await response.data.find(
      ({ name }) => name === repositoryName
    );

    expect(isPrivate).to.be.false;
    expect(repoName).to.equal('FrontEndStore');
  });

  it(`Should create a issue on a ${repositoryName} repository`, async () => {
    const issue = {
      title: 'Found a bug'
    };

    const response = await userLogged.post(
      `${urlBase}/repos/${githubUserName}/${repositoryName}/issues`,
      issue
    );

    expect(response.status).to.equal(StatusCodes.CREATED);

    issueCreated.title = response.data.title;
    issueCreated.number = response.data.number;

    expect(response.data.title).to.equal('Found a bug');
    expect(response.data.body).to.be.null;
  });

  it('Should make a pacth on issue created', async () => {
    const bodyPatch = {
      body: "I'm having a problem with this"
    };

    const response = await userLogged.patch(
      `${urlBase}/repos/${githubUserName}/${repositoryName}/issues/${issueCreated.number}`,
      bodyPatch
    );

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.title).to.equal(issueCreated.title);
    expect(response.data.body).to.equal("I'm having a problem with this");
  });
});
