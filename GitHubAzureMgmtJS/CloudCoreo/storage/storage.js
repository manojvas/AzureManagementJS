'use strict';

var storage = storage || {};
storage.keys = {};
storage.blobs = require('./blobService');
storage.tables = {};
storage.files = {};
storage.queues = {};
module.exports = storage;

