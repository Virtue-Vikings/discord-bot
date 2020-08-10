# must set config to use stackOrchestrator=kubernetes
docker stack rm odin-setup
docker stack deploy --compose-file docker-compose.yaml odin-setup