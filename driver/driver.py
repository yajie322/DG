from pymongo import MongoClient
from bson.objectid import ObjectId

DB_URL_LOCALE = 'mongodb://{}:{}'

class Driver:
  def __init__(self, host='172.17.0.1', port=27017, 
                     db='dg', collection='sketch'):
    url = DB_URL_LOCALE.format(host, port)
    self.collection = MongoClient(url)[db][collection]
    self._cache = {}

  def cached(function):
    def cached_function(*argv, **kw):
      cache = argv[0]._cache
      token = tuple([function.__name__] + list(argv[1:]))
      if token not in cache:
        cache[token] = function(*argv, **kw)
      return cache[token]
    return cached_function

  @cached
  def get_total_size(self):
    return self.collection.find().count()

  @cached
  def get_list_of_catagories(self):
    return self.collection.distinct('word')

  @cached
  def get_size_by_catagory(self, catagory):
    return self.collection.find({ 'word': catagory }).count()

  @cached
  def get_one_by_id(self, object_id):
    return self.collection.find_one({ '_id': ObjectId(object_id) })

  def get_data_of_multiple_catagories(self, catagory_list):
    return self.collection.find({ 'word': { '$in': catagory_list } })
  
  def get_data_of_catagory(self, catagory):
    return self.collection.find({ 'word': catagory })

  def get_all_data(self):
    return self.collection.find()

  def insert_one(self, data):
    self.collection.insert_one(data)
