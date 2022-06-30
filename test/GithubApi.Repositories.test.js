const axios = require('axios');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const md5 = require('md5');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const usersResource = 'users';
const reposResource = 'repos';
const githubUserName = 'aperdomob';
const repositoryName = 'jasmine-json-report';

const repositoryUrl = `${urlBase}/${reposResource}/${githubUserName}/${repositoryName}`;
const userUrl = `${urlBase}/${usersResource}/${githubUserName}`;

describe('Consume GET methods', () => {
  it(`Checking name, company, and location to the given user "${githubUserName}"`, async () => {
    const response = await axios.get(
      `${urlBase}/${usersResource}/${githubUserName}`,
      {
        headers: {
          Authorization: `${process.env.ACCESS_TOKEN}`
        }
      }
    );

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.name).to.equal('Alejandro Perdomo');
    expect(response.data.company).to.equal('Perficient Latam');
    expect(response.data.location).to.equal('Colombia');
  });

  it(`Check full name, private, and description given repository name "${repositoryName}"`, async () => {
    const response = await axios.get(`${userUrl}/repos`, {
      headers: {
        Authorization: `${process.env.ACCESS_TOKEN}`
      }
    });

    expect(response.status).to.equal(StatusCodes.OK);

    const repository = await response.data.find(
      ({ name }) => name === repositoryName
    );

    expect(repository.full_name).to.equal('aperdomob/jasmine-json-report');
    expect(repository.private).to.be.false;
    expect(repository.description).to.equal('A Simple Jasmine JSON Report');
  });

  it('Should download repository in zip', async () => {
    const response = await axios.get(`${repositoryUrl}/zipball/master`, {
      headers: {
        Authorization: `${process.env.ACCESS_TOKEN}`
      }
    });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers['content-type']).to.equal('application/zip');
  });

  it('Getting and verifying name, path and sha from README.md', async () => {
    const fileName = 'README.md';
    const filePath = 'README.md';
    const fileSha = '360eee6c223cee31e2a59632a2bb9e710a52cdc0';

    const expectedFormat = {
      name: fileName,
      path: filePath,
      sha: fileSha
    };

    const response = await axios.get(`${repositoryUrl}/contents`, {
      headers: {
        Authorization: `${process.env.ACCESS_TOKEN}`
      }
    });

    expect(response.status).to.equal(StatusCodes.OK);

    const readmeFile = await response.data.find(
      ({ name }) => name === fileName
    );

    expect(readmeFile).to.containSubset(expectedFormat);
  });

  it('Verify md5 from README.md', async () => {
    const response = await axios.get(
      'https://raw.githubusercontent.com/aperdomob/jasmine-json-report/master/README.md',
      {
        headers: {
          Authorization: `${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const expectedMd5 = md5(response.data);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(md5(response.data)).to.equal(expectedMd5);
  });
});
