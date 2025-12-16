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
        sh '/opt/homebrew/bin/node -v'
        sh '/opt/homebrew/bin/npm -v'
        sh '/opt/homebrew/bin/npm ci'
      }
    }

    stage('Run Tests (JUnit)') {
      steps {
        sh 'mkdir -p reports/junit reports/screenshots reports'
        sh 'npm run test:ci'
      }
      post {
        always {
          junit 'reports/junit/results.xml'
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
