run:
	$(MAKE) shared-services
	if $(MAKE) tables; then \
		echo TABLES CREATED; \
	else \
		echo "-----> TABLES ALREADY EXISTS, SKIPPING CREATION"; \
	fi
	$(MAKE) app

clean:
	$(MAKE) down-all
	$(MAKE) force-destroy
	rm -rf tmp

down-all:
	$(MAKE) down-app
	if $(MAKE) clean-tables; then \
		echo TABLES DELETED; \
	else \
		echo TABLES ALREADY DELETED; \
	fi
	$(MAKE) down-shared-services
	rm -rf tmp

app:
	docker-compose up

down-app:
	docker-compose down

down-shared-services:
	docker-compose -f docker-compose-shared.yml down

shared-services:
	docker-compose -f docker-compose-shared.yml up -d

network:
	docker network inspect xepelin-shared-network >/dev/null 2>&1 || docker network create xepelin-shared-network

tables:
	./scripts/wait-for.sh localhost:8000 -t 10 -- ./scripts/init-tables.sh

clean-tables:
	./scripts/wait-for.sh localhost:8000 -t 10 -- ./scripts/delete-tables.sh

force-destroy:
	docker-compose -f docker-compose-shared.yml down --rmi all
	docker-compose down --rmi all
