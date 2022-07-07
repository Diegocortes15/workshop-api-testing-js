const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const repository = {
  url: 'https://github.com/aperdomob/redirect-test'
};

describe('a', () => {
  it('Verify that response has redirected url with HEAD method', async () => {
    const response = await axios.head(repository.url);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.request.res.responseUrl).to.equal(
      'https://github.com/aperdomob/new-redirect-test'
    );

    repository.redirectedUrl = response.request.res.responseUrl;
  });

  it('Verify that response has redirected url with GET method', async () => {
    const response = await axios.get(repository.url);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.request.res.responseUrl).to.equal(repository.redirectedUrl);
  });
});
