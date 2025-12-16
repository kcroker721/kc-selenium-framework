pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '10'))
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
        echo '🧪 RUNNING TESTS'
        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        sh 'mkdir -p reports reports/screenshots'
        
        echo '📊 Generating JUnit report...'
        sh 'npm run test:junit'
        
        echo '📈 Generating HTML report...'
        sh 'npm run test:html'
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
