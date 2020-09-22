pipeline {
    agent any
    options{
        timestamps()
    }
    stages{
        stage("Go Build"){
            steps{
                sh "docker build -t fmda.frontend:B${Build_Number} -f Dockerfile ."
            
            }
            
            
        }
       
      
    }

}
