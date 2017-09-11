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

function downloadContributorAvatar(contributor) {
  const localPath = `avatars/${contributor.login}.jpg`;
  downloadImageByURL(contributor.avatar_url, localPath);
}

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: `https://${process.env.GITHUB_USER}:${process.env.GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  request(options, (err, response, body) => {
    const contributors = JSON.parse(body);
    cb(err, contributors);
  });
}



console.log('Welcome to the GitHub Avatar Downloader!');
const repoOwner = process.argv[2];
const repoName = process.argv[3];

if(repoOwner && repoName) {
  getRepoContributors(repoOwner, repoName, (err, contributors) => {
    if (err) { throw err; }

    for (const contributor of contributors) {
      downloadContributorAvatar(contributor);
    }
    console.log('Avatars downloaded!');
  });
} else {
  console.log('Please specify the repo owner and name!');
}

