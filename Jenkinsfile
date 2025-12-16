pipeline {
  agent any

  options {
    timestamps()
         script {
          parallel(
            'Amazon Tests': {
              echo '🛒 Running Amazon tests (JUnit + HTML)...'
              sh 'npm run test:amazon:report'
              echo '✅ Amazon tests complete'
            },
            'Smoke Tests': {
              echo '🔥 Running Smoke tests (JUnit + HTML)...'
              sh 'npm run test:smoke:report'
              echo '✅ Smoke tests complete'
            },
            'Target Tests': {
              echo '🎯 Running Target tests (JUnit + HTML)...'
              sh 'npm run test:target:report'
              echo '✅ Target tests complete'
            },
            'Walmart Tests': {
              echo '🏪 Running Walmart tests (JUnit + HTML)...'
              sh 'npm run test:walmart:report'
              echo '✅ Walmart tests complete'
            },
            'Best Buy Tests': {
              echo '💙 Running Best Buy tests (JUnit + HTML)...'
              sh 'npm run test:bestbuy:report'
              echo '✅ Best Buy tests complete'
            },
            'eBay Tests': {
              echo '📦 Running eBay tests (JUnit + HTML)...'
              sh 'npm run test:ebay:report'
              echo '✅ eBay tests complete'
            }
          )
        }der(logRotator(numToKeepStr: '10'))
    quietPeriod(0)
    skipDefaultCheckout(false)
  }

  triggers {
    cron('H 0 * * *')
  }

  environment {
    PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    HEADLESS = 'true'
    BROWSER  = 'chrome'
    BASE_URL = 'https://the-internet.herokuapp.com'
    USERNAME = 'tomsmith'
    PASSWORD = 'SuperSecretPassword!'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        echo '📦 CHECKING OUT CODE'
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        checkout scm
      }
    }

    stage('Install') {
      steps {
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        echo '🔧 INSTALLING DEPENDENCIES'
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        script {
          sh 'echo "Node: $(node -v)"'
          sh 'echo "NPM: $(npm -v)"'
        }
        sh 'npm ci --quiet'
        echo '✅ Dependencies installed successfully'
      }
    }

    stage('Test') {
      steps {
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        echo '🧪 RUNNING TESTS IN PARALLEL'
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        sh 'mkdir -p reports reports/screenshots'
        
        script {
          parallel(
            'Amazon Tests': {
              echo '� Running Amazon tests (JUnit + HTML)...'
              sh 'npm run test:amazon:report'
              echo '✅ Amazon tests complete'
            },
            'Smoke Tests': {
              echo '� Running Smoke tests (JUnit + HTML)...'
              sh 'npm run test:smoke:report'
              echo '✅ Smoke tests complete'
            }
          )
        }
        
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        echo '✅ ALL PARALLEL TESTS COMPLETE'
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      }
    }
  }

  post {
    always {
      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      echo '📋 PUBLISHING RESULTS'
      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      
      junit allowEmptyResults: true, testResults: 'reports/junit.xml'
      archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true
      
      script {
        def testResults = junit(allowEmptyResults: true, testResults: 'reports/junit.xml')
        if (testResults?.totalCount > 0) {
          echo "✅ Tests: ${testResults.totalCount} | ✔️ Passed: ${testResults.passCount} | ❌ Failed: ${testResults.failCount}"
        }
      }
    }
    
    success {
      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      echo '✅ BUILD SUCCESSFUL'
      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    }
    
    failure {
      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      echo '❌ BUILD FAILED'
      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    }
  }
}
