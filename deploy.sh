#!/bin/bash

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="YOUR_ACCOUNT_ID"
ECR_REPO_NAME="muffin-and-bug-blog"
CLUSTER_NAME="blog-cluster"
SERVICE_NAME="blog-service"

# Build and push Docker image
echo "Building Docker image..."
docker build -t ${ECR_REPO_NAME} .

# Tag for ECR
docker tag ${ECR_REPO_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest

# Login to ECR
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Push image
echo "Pushing to ECR..."
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest

# Update ECS service
echo "Updating ECS service..."
aws ecs update-service \
  --cluster ${CLUSTER_NAME} \
  --service ${SERVICE_NAME} \
  --force-new-deployment

echo "Deployment complete!"
