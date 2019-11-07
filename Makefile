APP := $(shell basename $(abspath $(dir $(lastword $(MAKEFILE_LIST)))))
ENV ?= staging
REGISTERY = registry.$(ENV).wizzitdigital.com

default: build

# ==>
.PHONY: dev release push push-$(ENV)

dev:
	docker-compose up -d db
	yarn start
	docker-compose down --v

release:
	docker-compose build release

push: VERSION=$(shell node -p "require('./package.json').version")
push: push-$(ENV)

push-$(ENV):
	# PUSH $(APP) TO $(REGISTERY)
	docker tag $(APP):latest $(REGISTERY)/$(APP):$(VERSION)
	docker push $(REGISTERY)/$(APP):$(VERSION)
# ==>
.PHONY: psql dump-db

psql:
	docker-compose exec db bash -c 'psql -U wizzit_pay -d wizzit_pay'

dump-db:
	rm server/migrations/production.sql
	docker-compose exec db bash -c \
	 'pg_dump -U wizzit_pay --data-only --table=merchant_users wizzit_pay' \
	 >> server/migrations/production.sql

# ==> Examples for production
.PHONY: migrate restore-db

migrate:
	docker-compose exec portal yarn migrate

restore-db: container = $(shell docker inspect -f '{{.Name}}' $$(docker-compose ps -q db) | cut -c2-)
restore-db:
	cat production.sql | docker exec -i $(container) psql -U wizzit_pay wizzit_pay
