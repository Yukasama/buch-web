import dotenv from 'dotenv'
import process from 'node:process'
import scanner from 'sonarqube-scanner'

dotenv.config()
const sonarToken = process.env.SONAR_TOKEN

scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectName': 'buch-web',
      'sonar.projectDescription': 'Buch Web',
      'sonar.projectVersion': '2024.06.0',
      'sonar.sources': 'app',
      'sonar.tests': '__tests__',
      'sonar.token': sonarToken,
      'sonar.scm.disabled': 'true',
      'sonar.javascript.environments': 'node',
      'sonar.exclusions':
        'node_modules/**,.extras/**,.scannerwork/*,.vscode/*,coverage/**,dist/*,log/*',
      'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
    },
  },
  () => process.exit(),
)
