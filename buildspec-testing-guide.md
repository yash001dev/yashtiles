# CodeBuild Local Testing Guide

## Prerequisites
1. Install CodeBuild Local Agent:
   ```bash
   git clone https://github.com/aws/aws-codebuild-docker-images.git
   cd aws-codebuild-docker-images/local_builds
   ```

2. Download the local CodeBuild agent:
   ```bash
   # For Windows/Linux
   wget https://raw.githubusercontent.com/aws/aws-codebuild-docker-images/master/local_builds/codebuild_build.sh
   chmod +x codebuild_build.sh
   ```

## Run Local Build Test

### Test Production Branch Simulation:
```bash
# Set environment variables to simulate production branch
export CODEBUILD_WEBHOOK_HEAD_REF="refs/heads/production"
export CODEBUILD_RESOLVED_SOURCE_VERSION="12345678abcdef"

# Run local build (dry-run mode)
./codebuild_build.sh -i aws/codebuild/amazonlinux2-x86_64-standard:3.0 -a ./artifacts -s ./yashtiles -b buildspec.yml
```

### Test Stage Branch Simulation:
```bash
# Set environment variables to simulate stage branch
export CODEBUILD_WEBHOOK_HEAD_REF="refs/heads/stage"
export CODEBUILD_RESOLVED_SOURCE_VERSION="87654321fedcba"

# Run local build
./codebuild_build.sh -i aws/codebuild/amazonlinux2-x86_64-standard:3.0 -a ./artifacts -s ./yashtiles -b buildspec.yml
```

## Alternative: Docker-based Testing

You can also test individual phases using Docker:

```bash
# Test the build phase only
docker run --rm -v $(pwd):/workspace -w /workspace \
  -e CODEBUILD_WEBHOOK_HEAD_REF="refs/heads/production" \
  -e CODEBUILD_RESOLVED_SOURCE_VERSION="12345678" \
  -e AWS_DEFAULT_REGION="ap-south-1" \
  -e AWS_ACCOUNT_ID="891377388489" \
  amazonlinux:latest bash -c "
    # Install required tools
    yum update -y && yum install -y docker aws-cli jq
    
    # Test the environment variable logic
    if [ \"\$CODEBUILD_WEBHOOK_HEAD_REF\" = \"refs/heads/production\" ]; then
      export ECR_REPOSITORY_NAME=\"photoframix-frontend-production\"
      export ECS_TASK_FAMILY=\"photoframix-frontend-production-task-family\"
      echo \"✅ Production branch configuration loaded\"
      echo \"ECR Repository: \$ECR_REPOSITORY_NAME\"
      echo \"Task Family: \$ECS_TASK_FAMILY\"
    else
      echo \"❌ Branch condition not met\"
    fi
  "
```
