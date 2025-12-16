pipeline {
  agent any

  options { timestamps() }

  triggers {
    cron('H 0 * * *')
  }

  environment {
    PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    HEADLESS = 'true'
    BROWSER  = 'chrome'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'mkdir -p reports'
        sh 'npm run test:junit'
        sh 'npm run test:html'
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'reports/junit.xml'
      archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
    }
  }
}
