const git = require('./git-utilities.js');

function incrementStarCount(repoName, starredRepoList) {
  if (repoName in starredRepoList.starCounts) {
    starredRepoList.starCounts[repoName] += 1;
  } else {
    starredRepoList.starCounts[repoName] = 1;
  }
}

function printTopRepos (starredRepoList, numToPrint) {
  console.log(starredRepoList);
}

function getRecommendedRepos() {
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
  if (typeof process.env.GITHUB_TOKEN !== 'string') {
    console.log('Please add a GitHub access token to the .env file (GITHUB_TOKEN=<your_token>)');
    return;
  }

  let starredRepoList = {
    responses: 0,
    starCounts: {}
  };

  git.getRepoContributors(repoOwner, repoName, (parsedResponse) => {

    for (const contributor of parsedResponse) {
      git.getStarredRepos(contributor, (starredRepo) => {
        incrementStarCount(starredRepo.full_name, starredRepoList);
      }, () => {
        starredRepoList.responses += 1;
        if (starredRepoList.responses === parsedResponse.length) {
          printTopRepos(starredRepoList, 5);
        }
      });
    }
  });

}

getRecommendedRepos();