pipeline {
    agent any
    
tools {
        nodejs 'node18'
    }
    
    environment {
        DOCKER_IMAGE = "rajeshtutta123/ajio_project"
    }
    
    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                credentialsId: 'rajeshcred',
                url: 'https://github.com/rajeshtutta/ajio.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:latest .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:latest'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f ajio_container || true
                docker run -d -p 1435:1435 --name ajio_container $DOCKER_IMAGE:latest
                '''
            }
        }
    }
}
