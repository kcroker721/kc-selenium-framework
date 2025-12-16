pipeline {
  agent any

  options {
    timestamps()
  }

  triggers {
    // Runs once per day around midnight.
    // 'H' = hash to avoid everyone starting at exactly 00:00.
    cron('H 0 * * *')
  }

  environment {
    // Force CI to be headless regardless of local .env
    PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    HEADLESS = 'true'
    BROWSER = 'chrome'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'npm ci'
        sh 'mkdir -p reports'
        sh 'npm run test:junit'
        sh 'npm run test:html'
      }
    }

    stage('Run Tests (JUnit)') {
      steps {
        sh 'mkdir -p reports/junit reports/screenshots reports'
        sh 'npm run test:ci'
      }
      post {
        always {
          junit 'reports/junit.xml'
        }
      }
    }

    stage('Run Tests (HTML report)') {
      steps {
        sh 'npm run test:html'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
    }
  }
}
