
# This will be run by jenkins post build task. It will deploy our recently added changes
docker-compose -f docker-compose.staging.yml down
docker-compose -f docker-compose.staging.yml up -d --build