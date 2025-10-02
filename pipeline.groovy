pipeline {
    agent {
        label 'test'
    }
    environment {
        WORKSPACE_DIR = '/home/workspace/Test'
        WORK_DIR = '/home/apps/client'
        GIT_REPO = 'git@github.com:md-rejoyan-islam/SUST_EEE_IOT_CLIENT.git'
    }
    stages {
        stage('Clone Repository') {
            steps {
                script {
                        echo 'Cloning repository into workspace'
                        git branch: 'main', url: "${GIT_REPO}"
                }
            }
        }
        stage('Generate .env file') {
            steps {
                script {
                    def envContent = '''
                        API_URL = http://localhost:5050
                        NEXT_PUBLIC_API_URL = http://localhost:5050
                        NEXT_PUBLIC_NODE_ENV = development
                        NODE_ENV = development
                        NEXT_PUBLIC_CLIENT_URL = https://neuronomous.net
                        '''
                    writeFile file: "${WORKSPACE}/.env", text: envContent
                    echo '✅ .env file generated'
                }
            }
        }

        stage('Npm Build') {
            steps {
                script {
                        echo '🔹 Installing dependencies...'
                        // Export PATH and verify Node/npm
                        sh '''
                            export PATH=/root/.nvm/versions/node/v22.19.0/bin:$PATH
                            npm install
                            npm run build
                        '''
                        echo '✅ Build completed successfully'
                }
            }
        }
        stage('Copy Build Files') {
            steps {
                script {
                        echo '🔹 Remove old WORK_DIR and create fresh'
                        sh """
                            if [ -d "${WORK_DIR}" ]; then
                                echo "Directory exists. Removing..."
                                rm -rf "${WORK_DIR}"
                            fi
                            mkdir -p "${WORK_DIR}"
                            echo "Directory ready: ${WORK_DIR}"
                        """
                        echo '🔹 Copy files from workspace to work dir'
                        sh """
                            cp -a ${WORKSPACE_DIR}/. ${WORK_DIR}/
                        """
                        echo '✅ Files copied to WORK_DIR successfully'
                }
            }
        }
        stage('Reload PM2') {
            steps {
                script {
                        echo '🔹 Reloading PM2'
                        sh """
                            # Ensure PM2 path
                            export PATH=/root/.nvm/versions/node/v22.19.0/bin:\$PATH
                            cd ${WORK_DIR}
                            # Reload if already running, else start
                            pm2 reload client || pm2 start npm --name "client" -- run start
                        """
                        echo '✅ PM2 reloaded successfully'
                }
            }
        }
    }

    post {
        always {
            script {
                    echo 'Cleaning up the build workspace directory'
                    cleanWs()
                    echo '✅ Workspace cleaned'
            }
        }
            success {
            script {
                node { // Runs on Jenkins host
                    emailext(
                    subject: "✅ SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """
                        ✅ Jenkins Build Successful!

                        🔹 Job Name: ${env.JOB_NAME}
                        🔹 Build Number: #${env.BUILD_NUMBER}
                        🔹 Branch: ${env.GIT_BRANCH}
                        🔹 Commit: ${env.GIT_COMMIT}
                        🔹 Triggered By: ${currentBuild.getBuildCauses()[0].shortDescription}
                        🔹 Duration: ${currentBuild.durationString}

                        📂 Workspace: ${env.WORKSPACE}
                        📄 Console Log: ${env.BUILD_URL}console
                        📦 Artifacts: ${env.BUILD_URL}artifact
                    """,
                    to: 'rejoyanislam0014@gmail.com'
                )
                }
            }
            }

        failure {
            script {
                node { // Runs on Jenkins host
                    emailext(
                    subject: "❌ FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """
                        ❌ Jenkins Build Failed!

                        🔹 Job Name: ${env.JOB_NAME}
                        🔹 Build Number: #${env.BUILD_NUMBER}
                        🔹 Branch: ${env.GIT_BRANCH}
                        🔹 Commit: ${env.GIT_COMMIT}
                        🔹 Triggered By: ${currentBuild.getBuildCauses()[0].shortDescription}
                        🔹 Duration: ${currentBuild.durationString}

                        ⚠️ Console Output: ${env.BUILD_URL}console
                        📦 Artifacts: ${env.BUILD_URL}artifact
                    """,
                    to: 'rejoyanislam0014@gmail.com'
                )
                }
            }
        }
    }
}
