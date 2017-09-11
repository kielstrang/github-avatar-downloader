const request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

const GITHUB_USER = "kielstrang";
const GITHUB_TOKEN = "bc5c433206b4bfac90f93add3e77277cda758b15";

function getRepoContributors(repoOwner, repoName, cb) {
  const requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;

  const options = {
    url: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };

  request(options, (err, response, body) => {
    const contributors = JSON.parse(body);
    for (const contributor of contributors) {
      console.log(contributor.avatar_url);
    }
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});