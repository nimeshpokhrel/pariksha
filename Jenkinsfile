// Pariksha CI/CD pipeline.
//
// Triggered on every commit to main (poll SCM now; GitHub webhook once cicd has SSL).
// Deploys in order: backend -> app -> landing. The heavy lifting runs as the
// 'awash' user via /home/awash/deploy.sh (see that script for env-file safety:
// it uses `git reset --hard` and never `git clean`, so the gitignored .env files
// are never touched).
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Update Source') {
            steps { sh 'sudo -u awash -H /home/awash/deploy.sh update' }
        }
        stage('Backend') {
            steps { sh 'sudo -u awash -H /home/awash/deploy.sh backend' }
        }
        stage('App') {
            steps { sh 'sudo -u awash -H /home/awash/deploy.sh app' }
        }
        stage('Landing') {
            steps { sh 'sudo -u awash -H /home/awash/deploy.sh landing' }
        }
        stage('Persist') {
            steps { sh 'sudo -u awash -H /home/awash/deploy.sh save' }
        }
    }

    post {
        success { echo 'Deploy succeeded: backend -> app -> landing' }
        failure { echo 'Deploy FAILED — check the stage logs above.' }
    }
}
