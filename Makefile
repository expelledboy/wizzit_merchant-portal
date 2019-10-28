export APP := $(shell basename $(abspath $(dir $(lastword $(MAKEFILE_LIST)))))
ENV ?= staging
REGISTERY = registry.$(ENV).wizzitdigital.com
VERSION=$(shell cat package.json   | grep version   |  sed -e 's/.*"version": "\(.*\)",/\1/')

default: build

# ==>
.PHONY: build dev cleanup

build:
	yarn build:webapp
	cp yarn.lock ./server/yarn.lock
	cp -R ./webapp/build ./server/webapp
	docker-compose build prod
	rm -rf ./server/yarn.lock
	rm -rf ./server/webapp

dev:
	docker-compose up server webapp

prod:
	docker-compose up prod

cleanup:
	docker-compose down --volumes

# ==>
.PHONY: push push-$(ENV)

push: push-$(ENV)

push-$(ENV):
	# PUSH $(APP) TO $(REGISTERY)
	docker tag $(APP):latest $(REGISTERY)/$(APP):$(VERSION)
	docker push $(REGISTERY)/$(APP):$(VERSION)
# ==>
.PHONY: psql

psql:
	docker-compose exec db bash -c 'psql -U wizzit_pay -d wizzit_pay'
