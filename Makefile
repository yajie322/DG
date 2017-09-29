PY=python

STORE_SCRIPT='./driver/store.py'
STORE_CONFIG='./config/store.cfg'

CLEAN_SCRIPT='./driver/clean.py'
CLEAN_CONFIG='./config/clean.cfg'

all: store

store:
	$(PY) $(STORE_SCRIPT) $(STORE_CONFIG)

clean:
	$(PY) $(CLEAN_SCRIPT) $(CLEAN_CONFIG)
