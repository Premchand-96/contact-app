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

        stage('Kill Old Processes') {
            steps {
                sh '''
                echo "Stopping old processes..."

                # Kill processes running on ports
                sudo fuser -k 3000/tcp || true
                sudo fuser -k 8081/tcp || true

                # Kill old node/http-server processes
                pkill -f "node server.js" || true
                pkill -f "http-server" || true

                # Delete old PM2 apps
                pm2 delete backend || true
                pm2 delete frontend || true

                pm2 save
                '''
            }
        }

        stage('Start Backend') {
            steps {
                dir('backend') {
                    sh '''
                    pm2 start server.js --name backend
                    pm2 save
                    '''
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    pm2 start http-server --name frontend -- -p 8081
                    pm2 save
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                echo "Checking PM2 processes..."
                pm2 list

                echo "Checking Backend..."
                curl http://localhost:3000/contacts

                echo "Checking Frontend..."
                curl http://localhost:8081
                '''
            }
        }
    }
}
