'use strict';
var azurestorage = require('azure-storage');
var storageKeysModule = require('./keys');
var blobService = {};
function BlobService(storageAccountName, callback){
   storageKeysModule.get(storageAccountName, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.info("Primary key: " + result.primaryKey);
            console.info("Secondary key: " + result.secondaryKey);
            if(result.primaryKey === null || typeof(result.primaryKey) === 'undefined')
            {
                throw new Error("Key cannot be null or empty.");
            }
            blobService = azurestorage.createBlobService(storageAccountName, result.primaryKey);

            return callback();
        }
    });

}

BlobService.prototype.createContainerIfNotExists = function(containerName, publicAccessLevel, callback){
    blobService.createContainerIfNotExists(containerName, {
        publicAccessLevel: publicAccessLevel
    }, callback);
};

module.exports = BlobService;