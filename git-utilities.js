require('dotenv').config();
const request = require('request');
const fs = require('fs');

const USER_AGENT = 'GitHub Avatar Downloader - Student Project';

function downloadImageByURL(url, filepath) {
  const options = {
    url: url,
    qs: {
      access_token: process.env.GITHUB_TOKEN
    },
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

function parseGitHubResponse(err, response, body, options) {
  if (err) { throw err; }

  if (response.statusCode > 299) {
    var errMsg = `GitHub returned "${response.statusCode} ${response.statusMessage}" from the request ${options.url}`;
    throw errMsg;
  }

  return JSON.parse(body);
}

function getStarredRepos(contributor, recordRepoCb, finalCb) {
  const starred_url = contributor.starred_url.split('{')[0];

  const options = {
    url: starred_url,
    qs: {
      access_token: process.env.GITHUB_TOKEN
    },
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  request(options, (err, response, body) => {
    for (starredRepo of parseGitHubResponse(err, response, body, options)) {
      recordRepoCb(starredRepo);
    }
    finalCb();
  });
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
    cb(parseGitHubResponse(err, response, body, options));
  });
}

module.exports = { downloadImageByURL, downloadContributorAvatar, getRepoContributors, getStarredRepos };