GIT=`which git`
REPO_DIR=`pwd`
cd ${REPO_DIR}
${GIT} add --all .
${GIT} commit -m "Test commit"
${GIT} push git@bitbucket.org:username/repo.git master