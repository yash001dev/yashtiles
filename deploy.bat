@echo off
REM AWS ECS Deployment Script for YashTiles (Windows)
REM Make sure to configure AWS CLI before running this script

setlocal enabledelayedexpansion

REM Configuration
set ECR_REPOSITORY_URI=YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/yashtiles
set CLUSTER_NAME=yashtiles-cluster
set SERVICE_NAME=yashtiles-service
set TASK_DEFINITION_NAME=yashtiles-task
set REGION=us-east-1

echo 🚀 Starting deployment process...

REM Get AWS account ID
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
echo Account ID: %ACCOUNT_ID%

echo 📦 Building Docker image...
docker build -t yashtiles:latest .

echo 🏷️ Tagging image for ECR...
docker tag yashtiles:latest %ECR_REPOSITORY_URI%:latest

echo 🔐 Logging into ECR...
for /f "tokens=*" %%i in ('aws ecr get-login-password --region %REGION%') do docker login --username AWS --password-stdin %ECR_REPOSITORY_URI% < echo %%i

echo ⬆️ Pushing image to ECR...
docker push %ECR_REPOSITORY_URI%:latest

echo 📝 Registering new task definition...
for /f "tokens=*" %%i in ('aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json --region %REGION% --query taskDefinition.taskDefinitionArn --output text') do set TASK_DEFINITION_ARN=%%i

echo Task Definition ARN: %TASK_DEFINITION_ARN%

echo 🔄 Updating ECS service...
aws ecs update-service --cluster %CLUSTER_NAME% --service %SERVICE_NAME% --task-definition %TASK_DEFINITION_ARN% --region %REGION%

echo ⏳ Waiting for deployment to complete...
aws ecs wait services-stable --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %REGION%

echo ✅ Deployment completed successfully!

REM Get service status
echo 📊 Service status:
aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME% --region %REGION% --query services[0].deployments[0] --output table

pause
