require('dotenv').config();
const request = require('request');
const fs = require('fs');

const USER_AGENT = 'GitHub Avatar Downloader - Student Project';

function downloadImageByURL(url, filepath) {
  const options = {
    url: url,
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  request.get(options)
    .on('error', (err) => { throw err; })
    .pipe(fs.createWriteStream(filepath));
}

function downloadContributorAvatar(contributor, path) {
  const fullPath = `${path}/${contributor.login}.jpg`;
  downloadImageByURL(contributor.avatar_url, fullPath);
}

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    qs: {
      access_token: process.env.GITHUB_TOKEN
    },
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  request(options, (err, response, body) => {
    //handle errors returned from GitHub
    if (err) { throw err; }

    if (response.statusCode > 299) {
      var errMsg = `GitHub returned the following error: ${response.statusCode} ${response.statusMessage}`;

      if (response.statusCode === 404) {
        errMsg = `Repository ${repoOwner}/${repoName} does not exist. (GitHub says: ${response.statusCode} ${response.statusMessage})`;
      }
      if (response.statusCode === 401) {
        errMsg = `Invalid GitHub access token. (GitHub says: ${response.statusCode} ${response.statusMessage})`;
      }
      throw errMsg;
    }

    cb(JSON.parse(body));
  });
}

module.exports = { downloadImageByURL, downloadContributorAvatar, getRepoContributors };