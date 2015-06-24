'use strict';
var storageManagement = require('azure-mgmt-storage');
var fs = require('fs');
var configSvc = require('./configSvc');
var configObj = configSvc.get();
var storageManagementClient = storageManagement.createStorageManagementClient(storageManagement.createCertificateCloudCredentials({
    subscriptionId: configObj.AzureSubscription.SubscriptionId,
    pem: fs.readFileSync(configObj.AzureSubscription.CertFile)
}));
module.exports = {

    list: function(callback)
    {
        storageManagementClient.storageAccounts.list(callback);
    },

    get: function(storageAccountName, callback)
    {
        storageManagementClient.storageAccounts.get(storageAccountName, callback);
    },

    create: function(storageConfig, callback)
    {
        console.log(storageConfig);
        storageManagementClient.storageAccounts.create({
            name: storageConfig.name,
            location: storageConfig.location,
            label: storageConfig.label,
            accountType: storageConfig.accountType
        }, callback);
    },

    delete: function(accountName, callback)
    {
        storageManagementClient.storageAccounts.deleteMethod(accountName, callback);
    },

    getKeys: function(storageAccountName, callback) {
        storageManagementClient.storageAccounts.getKeys(storageAccountName, callback);
    }
};