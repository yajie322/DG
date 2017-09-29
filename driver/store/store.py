import os
import sys
import json
from ConfigParser import ConfigParser
from pymongo import MongoClient

CONFIG = ConfigParser()
CONFIG.read('./store.cfg')

PROGRESS_STEP = 50
PROGRESS_BLOCK = 100 / PROGRESS_STEP

DIRECTORY_CONFIRMATION_LOCALE = 'Will read raw data from this directory: {}'
INITIATION = 'Traing data loading initiated...'
DB_CONNECTED = 'Connection to database established...'
DB_DETAIL_LOCALE = 'Host: {}\nPort: {}\nDatabase: {}\nCollection: {}'
CATAGORY_DETAIL_LOCALE = '{} catagories: {}'
READ_START_LOCAL = 'Reading data from file: {}'
READ_PROGRESS_BAR_LOCALE = '\rLoading progress: [{}] {}%'
COMPLETION = 'Traing data loading completed.'
STATISTICS = '{} records stored in total'

def connect():
  host = CONFIG.get('DB', 'Host')
  port = CONFIG.get('DB', 'Port')
  db = CONFIG.get('DB', 'Database')
  collection = CONFIG.get('DB', 'Collection')
  url = 'mongodb://{}:{}'.format(host, port, db)
  collection_socket = MongoClient(url)[db][collection]
  print DB_CONNECTED
  print
  print DB_DETAIL_LOCALE.format(host, port, db, collection)
  return collection_socket

def locate(directory):
  return [directory + file_name for file_name in os.listdir(directory)
                                if file_name.endswith('.ndjson')]

def size(file_name):
  with open(file_name, 'r') as doc:
    return sum(1 for _ in doc)

def show_progress(progress):
  bar = progress * '=' + '>' + (PROGRESS_STEP - progress) * ' '
  line = READ_PROGRESS_BAR_LOCALE.format(bar, progress * PROGRESS_BLOCK)
  sys.stdout.write(line)
  sys.stdout.flush()

def store_object(line, collection):
  obj = json.loads(line.strip())
  obj['_id'] = obj['key_id']
  del obj['timestamp']
  del obj['_id']
  collection.insert_one(obj)

def catagory(file_name):
  file_name = file_name.split('/')[-1]
  return os.path.splitext(file_name)[0].capitalize()

def store(file_name, collection):
  with open(file_name, 'r') as doc:
    print READ_START_LOCAL.format(catagory(file_name))
    completed, progress, total = 0, 0, size(file_name)
    show_progress(progress)
    for line in doc:
      store_object(line, collection)
      completed += PROGRESS_STEP
      if completed / total != progress:
        progress += 1
        show_progress(progress)
  print

def main():
  print
  data_directory = CONFIG.get('SOURCE', 'Directory')
  source_file_list = locate(data_directory)
  catagory_count = len(source_file_list)
  object_total = sum(size(file_name) for file_name in source_file_list)
  catagories = ', '.join([catagory(file_name) for file_name in source_file_list])
  collection = connect()

  print
  print DIRECTORY_CONFIRMATION_LOCALE.format(data_directory)
  print
  print INITIATION
  print
  print CATAGORY_DETAIL_LOCALE.format(catagory_count, catagories)
  print
  for file_name in source_file_list:
    store(file_name, collection)
    print
  print COMPLETION
  print STATISTICS.format(object_total)
  print

if __name__ == '__main__':
  main()
