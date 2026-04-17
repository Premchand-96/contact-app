pipeline {
    agent any

    stages {

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Deploy with PM2') {
            steps {
                sh '''
                # Install PM2 & http-server
                sudo npm install -g pm2 http-server

                # Kill old processes (ignore errors)
                sudo -u ec2-user pm2 delete backend || true
                sudo -u ec2-user pm2 delete frontend || true

                # Start Backend
                cd backend
                sudo -u ec2-user pm2 start server.js --name backend

                # Start Frontend
                cd ../frontend
                sudo -u ec2-user pm2 start "npx http-server -p 8081" --name frontend

                # Save PM2
                sudo -u ec2-user pm2 save
                '''
            }
        }
    }
}
