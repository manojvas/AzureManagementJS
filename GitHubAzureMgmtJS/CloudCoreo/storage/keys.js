var storageAccount = require('../storageAccount.js');
module.exports = {
    get: function(storageAccountName, callback)
    {
        storageAccount.getKeys(storageAccountName, callback);
    }
};
