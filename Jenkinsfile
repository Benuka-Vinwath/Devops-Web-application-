pipeline {
    agent any

    stages {
        stage('Check Docker') {
            steps {
                sh 'docker version'
                sh 'docker compose version'
            }
        }

        stage('Prepare .env') {
            steps {
                // the .env file is stored in Jenkins as a "Secret file" credential, never in Git
                withCredentials([file(credentialsId: 'ravens-env', variable: 'ENV_FILE')]) {
                    sh 'cp "$ENV_FILE" .env'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Smoke test') {
            steps {
                // give the backend time to run migrations, then check the API answers through nginx
                // (run inside the frontend container: "localhost" differs when Jenkins itself is in a container)
                sh '''
                    for i in $(seq 1 20); do
                        docker compose exec -T frontend wget -qO- http://localhost/api/trails > /dev/null && echo "API is up" && exit 0
                        sleep 3
                    done
                    docker compose logs --tail 50 backend
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose ps'
        }
    }
}
