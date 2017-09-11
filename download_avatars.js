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
    const contributors = JSON.parse(body);
    cb(err, contributors);
  });
}

function downloadRepoContributorAvatars() {
  console.log('Welcome to the GitHub Avatar Downloader');

  //read repo owner and name from the command line - fail if not given 2 arguments
  const args = require('optimist').argv;
  if (args._.length !== 2) {
    console.log('Please specify the repo owner and name');
    console.log(args);
    return;
  }
  const repoOwner = args._[0];
  const repoName = args._[1];

  //read a GitHub access token from the .env file - fail if not found
  require('dotenv').config();
  if(typeof process.env.GITHUB_TOKEN !== 'string') {
    console.log('Please add a GitHub access token to the .env file (GITHUB_TOKEN=<your_token>)');
    return;
  }

  getRepoContributors(repoOwner, repoName, (err, response) => {
    //handle errors returned from GitHub
    if (err) { throw err; }
    if (response.message === 'Not Found') {
      console.log('No repo found with the specified name and owner');
      return;
    }
    if (response.message === 'Bad credentials') {
      console.log('Invalid GitHub access token');
      return;
    }

    const path = 'avatars';
    if(!fs.existsSync(path)) {
      console.log(`Missing folder: ./${path}`);
      return;
    }

    for (const contributor of response) {
      downloadContributorAvatar(contributor, path);
    }
    console.log('Avatars downloaded!');
  });
}

downloadRepoContributorAvatars();
