install:
	npm ci
publish:
	npm publish --dry-run
lint:
	npx eslint .
link:
	npm link
setup: install publish
test:
	npm test
test-coverage:
	npm test -- -coverage --all