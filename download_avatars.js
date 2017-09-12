const git = require('./git-utilities.js');
const fs = require('fs');

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
  if(typeof process.env.GITHUB_TOKEN !== 'string') {
    console.log('Please add a GitHub access token to the .env file (GITHUB_TOKEN=<your_token>)');
    return;
  }

  git.getRepoContributors(repoOwner, repoName, (parsedResponse) => {
    const path = 'avatars';
    if(!fs.existsSync(path)) {
      console.log(`Missing folder: ./${path}`);
      return;
    }

    for (const contributor of parsedResponse) {
      git.downloadContributorAvatar(contributor, path);
    }
    console.log('Avatars downloaded!');
  });
}

downloadRepoContributorAvatars();
