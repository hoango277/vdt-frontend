pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker
        readOnly: true
  volumes:
    - name: kaniko-secret
      secret:
        secretName: dockerhub-secret
        items:
          - key: .dockerconfigjson
            path: config.json
"""
        }
    }
    environment {
        GIT_SOURCE_REPO = "https://github.com/hoango277/vdt-frontend"
        GIT_CONFIG_REPO = "https://github.com/hoango277/vdt-config-frontend"
        GIT_BRANCH = "main"
        GIT_CRED = "d69c1811-345b-49d4-ac3b-93211abfff77"
        VALUES_FILE = "values.yaml"
        BASE_IMAGE = "xuanhoa2772004/vdt-frontend"
    }
    stages {
        stage('Checkout Source Repo') {
            steps {
                dir('source') {
                    git branch: "${env.GIT_BRANCH}", credentialsId: "${env.GIT_CRED}", url: "${env.GIT_SOURCE_REPO}"
                }
            }
        }
        stage('Check Tag On Commit') {
            steps {
                dir('source') {
                    script {
                        sh 'git fetch --tags'
                        def tagName = sh(
                            script: 'git describe --tags --exact-match || true',
                            returnStdout: true
                        ).trim()
                        if (tagName) {
                            echo "Commit hiện tại là một tag: ${tagName} => tiếp tục build."
                            env.TAG_NAME = tagName
                            env.DOCKER_IMAGE = "${BASE_IMAGE}:${tagName}"
                            echo "==> [DEBUG] env.TAG_NAME = ${env.TAG_NAME}"
                            echo "==> [DEBUG] env.DOCKER_IMAGE = ${env.DOCKER_IMAGE}"
                        } else {
                            echo "Commit hiện tại KHÔNG phải là một tag. Abort pipeline."
                            currentBuild.result = 'ABORTED'
                            error("Commit này không được gắn tag, không build!")
                        }
                    }
                }
            }
        }
        stage('Build & Push Docker Image') {
            steps {
                dir('source') {
                        container('kaniko') {
                            echo "==> TAG_NAME (latest): ${env.TAG_NAME}"
                            echo "==> DOCKER_IMAGE: ${env.DOCKER_IMAGE}"
                            sh """
                            /kaniko/executor --dockerfile=Dockerfile --context=. --destination=${env.DOCKER_IMAGE} --verbosity=debug
                            """
                        }
                }
            }
        }
        stage('Checkout Config Repo') {
            steps {
                dir('config') {
                    git branch: "${env.GIT_BRANCH}", credentialsId: "${env.GIT_CRED}", url: "${env.GIT_CONFIG_REPO}"
                }
            }
        }
        stage('Update values.yaml') {
            steps {
                dir('config') {
                    sh """
                    sed -i 's|^  tag:.*|  tag: \"${env.TAG_NAME}\"|' ${env.VALUES_FILE}
                    cat ${env.VALUES_FILE}
                    """
                }
            }
        }
        stage('Commit & Push to Config Repo') {
            steps {
                dir('config') {
                    withCredentials([usernamePassword(credentialsId: "${env.GIT_CRED}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                        git config user.email "ci-bot@yourdomain.com"
                        git config user.name "ci-bot"
                        git add ${env.VALUES_FILE}
                        git commit -m "Update image tag to ${env.TAG_NAME}" || echo "No changes to commit"
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/hoango277/vdt-config-frontend.git HEAD:${env.GIT_BRANCH}
                        """
                    }
                }
            }
        }
    }
    post {
        failure {
            echo "Pipeline failed. Please check the logs for more information."
        }
        aborted {
            echo "Pipeline aborted (not a tag release)."
        }
        success {
            echo "CI/CD completed successfully!"
        }
    }
}