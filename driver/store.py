import os
import sys
import json
from pymongo import MongoClient

DIRECTORY = '../data/'

PROGRESS_STEP = 20
PROGRESS_BLOCK = 5

DB_HOST = 'mongodb://172.17.0.1:27017/'
DB_NAME = 'dg'
COLLECTION_NAME = 'sketch'
COLLECTION = MongoClient(DB_HOST)[DB_NAME][COLLECTION_NAME]

INITIATION = 'Traing data loading initiated...'
CATAGORY_DETAIL_LOCALE = '{} catagories: {}'
READ_START_LOCAL = 'Reading data from file: {}'
READ_PROGRESS_BAR_LOCALE = '\rLoading progress: [{}] {}%'
COMPLETION = 'Traing data loading completed.'
STATISTICS = '{} records stored in total'

def locate():
  return [file_name for file_name in os.listdir(DIRECTORY)
                    if file_name.endswith('.ndjson')]

def size(file_name):
  with open(DIRECTORY + file_name, 'r') as doc:
    return sum(1 for _ in doc)

def show_progress(progress):
  bar = progress * '=' + '>' + (PROGRESS_STEP - progress) * ' '
  line = READ_PROGRESS_BAR_LOCALE.format(bar, progress * PROGRESS_BLOCK)
  sys.stdout.write(line)
  sys.stdout.flush()

def store_object(line):
  obj = json.loads(line.strip())
  obj['_id'] = obj['key_id']
  del obj['timestamp']
  del obj['_id']
  COLLECTION.insert_one(obj)

def catagory(file_name):
  return os.path.splitext(file_name)[0].capitalize()

def store(file_name):
  with open(DIRECTORY + file_name, 'r') as doc:
    print READ_START_LOCAL.format(catagory(file_name))
    completed, progress, total = 0, 0, size(file_name)
    show_progress(progress)
    for line in doc:
      store_object(line)
      completed += PROGRESS_STEP
      if completed / total != progress:
        progress += 1
        show_progress(progress)
  print

def main():
  source_file_list = locate()
  catagory_count = len(source_file_list)
  object_total = sum(size(file_name) for file_name in source_file_list)
  catagories = ', '.join([catagory(file_name) for file_name in source_file_list])

  print INITIATION
  print
  print CATAGORY_DETAIL_LOCALE.format(catagory_count, catagories)
  print
  for file_name in source_file_list:
    store(file_name)
    print
  print COMPLETION
  print STATISTICS.format(object_total)

if __name__ == '__main__':
  main()
