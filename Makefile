dev: 
	cd ./tb-fe && yarn dev
	
fe-build: 
	cd ./tb-fe && yarn build

up:
	docker-compose down
	docker-compose up -d

down:
	docker-compose down