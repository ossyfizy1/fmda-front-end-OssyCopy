#!/bin/bash
echo "Starting build ..."
# use the commit hash as tag
version=`git rev-parse --short HEAD`
docker build -t fmda_web_app -f prod.Dockerfile .
docker tag fmda_web_app telnetsp/fmda_web_app:$version
docker login -u "telnetsp" -p "simfonie@01" docker.io
docker push telnetsp/fmda_web_app:$version 
echo "Completed !"