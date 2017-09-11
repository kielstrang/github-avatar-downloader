const request = require('request');
const fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

const GITHUB_USER = "kielstrang";
const GITHUB_TOKEN = "bc5c433206b4bfac90f93add3e77277cda758b15";
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

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  request(options, (err, response, body) => {
    const contributors = JSON.parse(body);
    cb(err, contributors);
  });
}

// getRepoContributors("jquery", "jquery", (err, contributors) => {
//   for (const contributor of contributors) {
//     console.log(contributor.avatar_url);
//   }
// });

downloadImageByURL('https://avatars3.githubusercontent.com/u/46987?v=4', 'avatars/test-avatar.jpg');