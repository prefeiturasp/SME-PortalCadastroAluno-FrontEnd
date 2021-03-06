pipeline {
    agent {
      node { 
        label 'py-uniformes'
	    }
    }
    
    options {
      buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
      disableConcurrentBuilds()
      skipDefaultCheckout()  
    }
           
    stages {
       stage('CheckOut') {
        steps {
          step([$class: 'GitHubSetCommitStatusBuilder'])
          checkout scm	
        }
       }
       stage('Analise codigo') {
	       when {
           branch 'develop'
         }
            steps {
                sh 'sonar-scanner \
                   -Dsonar.projectKey=SME-portalcadastroAluno-FrontEnd \
                   -Dsonar.sources=. \
                   -Dsonar.host.url=http://sonar.sme.prefeitura.sp.gov.br \
                   -Dsonar.login=c05220d80e8bc91c5404888824aad96cae048455'
            }
       } 
       
       stage('Docker Build DEV') {
         when {
           branch 'develop'
         }
        steps {
          sh 'echo build docker image desenvolvimento'
          // Start JOB para build das imagens Docker e push SME Registry
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "4407b439-9635-44f9-bd25-ec4717ace723",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
        }
      }     
            
      stage('Deploy DEV') {
         when {
           branch 'develop'
         }
        steps {          
         //Start JOB de deploy Kubernetes 
          sh 'echo Deploy ambiente desenvolvimento'
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "6ec4fd5e-bd65-4734-8896-dcd1332eee88",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        } 
       }
       
      stage('Docker Build HOM') {
         when {
           branch 'homolog'
         }
        steps {
          
          sh 'echo Deploying ambiente homologacao'
                
          // Start JOB para build das imagens Docker e push SME Registry
      
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                             
              //JOB DE BUILD
              jobId: "0dc96ebf-c035-4947-b3fc-d652c81ab455",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
      }   
      
      stage('Deploy HOM') {
         when {
           branch 'homolog'
         }
        steps {
          timeout(time: 24, unit: "HOURS") {
          // telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
            input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'ebufaino, marcos_nastri, calvin_rossinhole, ollyver_ottoboni, kelwy_oliveira'
          }
          //Start JOB deploy Kubernetes 
         
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "57293e9a-b6c6-4a61-b883-d20b06986dca",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
      }

      stage('Docker Build PROD') {
         when {
           branch 'master'
         }
        steps {
          
          sh 'echo Build image docker Produção'
          // Start JOB para build das imagens Docker e push SME Registry
      
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                             
              //JOB DE BUILD
              jobId: "5cda739b-7d55-4de5-83f8-10b5158781a0",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
      }

      stage('Deploy PROD') {
         when {
           branch 'master'
         }
        steps {
          timeout(time: 24, unit: "HOURS") {
          // telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
            input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'ebufaino, marcos_nastri, calvin_rossinhole, ollyver_ottoboni, kelwy_oliveira'
          }   
          //Start JOB deploy kubernetes 
         
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "8b7d8ab9-45af-4bbc-bc83-ba3cbeaca5a0",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
              //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
       }
    } 
  	   
  post {
        always {
          echo 'One way or another, I have finished'
        }
        success {
	  step([$class: 'GitHubCommitStatusSetter'])
          telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Esta ok !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n\n Uma nova versão da aplicação esta disponivel!!!")
        }
        unstable {
          step([$class: 'GitHubCommitStatusSetter'])
          telegramSend("O Build ${BUILD_DISPLAY_NAME} <${env.BUILD_URL}> - Esta instavel ...\nConsulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)")
        }
        failure {
          step([$class: 'GitHubCommitStatusSetter'])
          telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME}  - Quebrou. \nConsulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)")
        }
        changed {
          echo 'Things were different before...'
        }
        aborted {
          step([$class: 'GitHubCommitStatusSetter'])
          telegramSend("O Build ${BUILD_DISPLAY_NAME} - Foi abortado.\nConsulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)")
        }
    }
}
