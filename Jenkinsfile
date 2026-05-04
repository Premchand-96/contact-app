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

        stage('Stop Old PM2 Processes') {
            steps {
                sh '''
                echo "Stopping old PM2 applications..."

                pm2 delete backend || true
                pm2 delete frontend || true

                pm2 save
                sleep 5
                '''
            }
        }

        stage('Start Backend') {
            steps {
                dir('backend') {
                    sh '''
                    echo "Starting backend..."

                    pm2 start server.js --name backend

                    pm2 save
                    sleep 5

                    pm2 list
                    '''
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    echo "Starting frontend..."

                    pm2 delete frontend || true

                    pm2 start http-server --name frontend -- . -p 8081 -a 0.0.0.0

                    pm2 save
                    sleep 5

                    pm2 list
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Checking Backend API..."
                curl http://localhost:3000/contacts

                echo "Checking Frontend..."
                curl http://localhost:8081
                '''
            }
        }
    }
}
