stage('Build & Deploy') {
    steps {
        sh '''
        # Install tools
        sudo npm install -g pm2 http-server

        # Backend
        cd backend
        sudo -u ec2-user pm2 delete backend || true
        sudo -u ec2-user pm2 start server.js --name backend

        # Frontend
        cd ../frontend
        sudo -u ec2-user pm2 delete frontend || true
        sudo -u ec2-user pm2 start "npx http-server -p 8081" --name frontend

        sudo -u ec2-user pm2 save
        '''
    }
}
