pipeline {
    agent { label 'Linux-Agent-01' }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Premchand-96/contact-app.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                sh '''
                sudo npm install -g http-server
                '''
            }
        }

        stage('Deploy Backend with PM2') {
            steps {
                dir('backend') {
                    sh '''
                    sudo npm install -g pm2

                    # Stop old backend if exists
                    pm2 delete backend || true

                    # Start backend
                    pm2 start server.js --name backend

                    pm2 save
                    '''
                }
            }
        }

        stage('Deploy Frontend with PM2') {
            steps {
                dir('frontend') {
                    sh '''
                    # Stop old frontend if exists
                    pm2 delete frontend || true

                    # Start frontend on port 8081
                    pm2 start "http-server -p 8081" --name frontend --interpreter bash

                    pm2 save
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                pm2 list
                curl http://localhost:3000/contacts
                curl http://localhost:8081
                '''
            }
        }
    }
}
