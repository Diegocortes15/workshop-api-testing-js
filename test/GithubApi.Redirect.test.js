const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const repositoryUrl = 'https://github.com/aperdomob/redirect-test';
const expectedRedirectUrl = 'https://github.com/aperdomob/new-redirect-test';

describe('Consume HEAD method and test redirecting url', () => {
  it('Verify that response has redirected url with HEAD method', async () => {
    const response = await axios.head(repositoryUrl);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.request.res.responseUrl).to.equal(
      'https://github.com/aperdomob/new-redirect-test'
    );
  });

  it('Verify that response has redirected url with GET method', async () => {
    const response = await axios.get(repositoryUrl);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.request.res.responseUrl).to.equal(expectedRedirectUrl);
  });
});
