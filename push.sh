GIT=`which git`
REPO_DIR=`pwd`
cd ${REPO_DIR}
${GIT} add --all .
${GIT} commit -m "Test commit"
${GIT} push