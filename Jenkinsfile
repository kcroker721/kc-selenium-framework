pipeline {pipeline {

  agent any  agent any



  options {  options {

    timestamps()    timestamps()

    buildDiscarder(logRotator(numToKeepStr: '10'))         script {

    quietPeriod(0)          parallel(

    skipDefaultCheckout(false)            'Amazon Tests': {

  }              echo '🛒 Running Amazon tests (JUnit + HTML)...'

              sh 'npm run test:amazon:report'

  triggers {              echo '✅ Amazon tests complete'

    cron('H 0 * * *')            },

  }            'Target Tests': {

              echo '🎯 Running Target tests (JUnit + HTML)...'

  environment {              sh 'npm run test:target:report'

    PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"              echo '✅ Target tests complete'

    HEADLESS = 'true'            },

    BROWSER  = 'chrome'            'Walmart Tests': {

    BASE_URL = 'https://the-internet.herokuapp.com'              echo '🏪 Running Walmart tests (JUnit + HTML)...'

    USERNAME = 'tomsmith'              sh 'npm run test:walmart:report'

    PASSWORD = 'SuperSecretPassword!'              echo '✅ Walmart tests complete'

  }            },

            'Best Buy Tests': {

  stages {              echo '💙 Running Best Buy tests (JUnit + HTML)...'

    stage('Checkout') {              sh 'npm run test:bestbuy:report'

      steps {              echo '✅ Best Buy tests complete'

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'            },

        echo '📦 CHECKING OUT CODE'            'eBay Tests': {

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'              echo '📦 Running eBay tests (JUnit + HTML)...'

        checkout scm              sh 'npm run test:ebay:report'

      }              echo '✅ eBay tests complete'

    }            },

            'Smoke Tests': {

    stage('Install') {              echo '🔥 Running Smoke tests (JUnit + HTML)...'

      steps {              sh 'npm run test:smoke:report'

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'              echo '✅ Smoke tests complete'

        echo '🔧 INSTALLING DEPENDENCIES'            }

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'          )

        script {        }der(logRotator(numToKeepStr: '10'))

          sh 'echo "Node: $(node -v)"'    quietPeriod(0)

          sh 'echo "NPM: $(npm -v)"'    skipDefaultCheckout(false)

        }  }

        sh 'npm ci --quiet'

        echo '✅ Dependencies installed successfully'  triggers {

      }    cron('H 0 * * *')

    }  }



    stage('Test') {  environment {

      steps {    PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'    HEADLESS = 'true'

        echo '🧪 RUNNING TESTS IN PARALLEL (6 SUITES)'    BROWSER  = 'chrome'

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'    BASE_URL = 'https://the-internet.herokuapp.com'

        sh 'mkdir -p reports reports/screenshots'    USERNAME = 'tomsmith'

            PASSWORD = 'SuperSecretPassword!'

        script {  }

          parallel(

            'Amazon Tests': {  stages {

              echo '🛒 Running Amazon tests (10 files, 52+ tests)...'    stage('Checkout') {

              sh 'npm run test:amazon:report'      steps {

              echo '✅ Amazon tests complete'        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

            },        echo '📦 CHECKING OUT CODE'

            'Target Tests': {        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

              echo '🎯 Running Target tests...'        checkout scm

              sh 'npm run test:target:report'      }

              echo '✅ Target tests complete'    }

            },

            'Walmart Tests': {    stage('Install') {

              echo '🏪 Running Walmart tests...'      steps {

              sh 'npm run test:walmart:report'        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

              echo '✅ Walmart tests complete'        echo '🔧 INSTALLING DEPENDENCIES'

            },        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

            'Best Buy Tests': {        script {

              echo '💙 Running Best Buy tests...'          sh 'echo "Node: $(node -v)"'

              sh 'npm run test:bestbuy:report'          sh 'echo "NPM: $(npm -v)"'

              echo '✅ Best Buy tests complete'        }

            },        sh 'npm ci --quiet'

            'eBay Tests': {        echo '✅ Dependencies installed successfully'

              echo '📦 Running eBay tests...'      }

              sh 'npm run test:ebay:report'    }

              echo '✅ eBay tests complete'

            },    stage('Test') {

            'Smoke Tests': {      steps {

              echo '🔥 Running Smoke tests...'        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

              sh 'npm run test:smoke:report'        echo '🧪 RUNNING TESTS IN PARALLEL'

              echo '✅ Smoke tests complete'        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

            }        sh 'mkdir -p reports reports/screenshots'

          )        

        }        script {

                  parallel(

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'            'Amazon Tests': {

        echo '✅ ALL 6 TEST SUITES COMPLETE'              echo '� Running Amazon tests (JUnit + HTML)...'

        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'              sh 'npm run test:amazon:report'

      }              echo '✅ Amazon tests complete'

    }            },

  }            'Smoke Tests': {

              echo '� Running Smoke tests (JUnit + HTML)...'

  post {              sh 'npm run test:smoke:report'

    always {              echo '✅ Smoke tests complete'

      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'            }

      echo '📋 PUBLISHING RESULTS'          )

      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'        }

              

      junit allowEmptyResults: true, testResults: 'reports/junit.xml'        echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

      archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true        echo '✅ ALL PARALLEL TESTS COMPLETE'

              echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

      script {      }

        def testResults = junit(allowEmptyResults: true, testResults: 'reports/junit.xml')    }

        if (testResults?.totalCount > 0) {  }

          echo "✅ Tests: ${testResults.totalCount} | ✔️ Passed: ${testResults.passCount} | ❌ Failed: ${testResults.failCount}"

        }  post {

      }    always {

    }      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

          echo '📋 PUBLISHING RESULTS'

    success {      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'      

      echo '✅ BUILD SUCCESSFUL'      junit allowEmptyResults: true, testResults: 'reports/junit.xml'

      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'      archiveArtifacts artifacts: 'reports/**/*', allowEmptyArchive: true

    }      

          script {

    failure {        def testResults = junit(allowEmptyResults: true, testResults: 'reports/junit.xml')

      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'        if (testResults?.totalCount > 0) {

      echo '❌ BUILD FAILED'          echo "✅ Tests: ${testResults.totalCount} | ✔️ Passed: ${testResults.passCount} | ❌ Failed: ${testResults.failCount}"

      echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'        }

    }      }

  }    }

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
