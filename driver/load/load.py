from pymongo import MongoClient

def connect():
  host = CONFIG.get('DB', 'Host')
  port = CONFIG.get('DB', 'Port')
  db = CONFIG.get('DB', 'Database')
  collection = CONFIG.get('DB', 'Collection')
  url = 'mongodb://{}:{}'.format(host, port, db)
  return MongoClient(url)[db][collection]
