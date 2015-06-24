'use strict';
var cloudService = require('./cloudService');
var vms = require('./virtualMachines');
var network = require('./networks');
var storageAccount = require('./storageAccount');
var storage = require('./storage/storage.js');

var coreo = coreo || {};
coreo.azure = coreo.azure || {};
coreo.azure.commandLine = {};
coreo.azure.controller = {};
coreo.azure.controller.cloudService = {};
coreo.azure.controller.networks = {};
coreo.azure.controller.virtualMachines = {};
coreo.azure.controller.storageAccount = {};
coreo.azure.controller.storage = {};

coreo.azure.controller.configuration = function()
{
    var config = {};

    config.serviceName = "coreoTestService01";
    config.serviceLabel = "coreoTestService01Label";
    config.serviceLocation = "South Central US";

    config.affinityGroupName = "ag01";
    config.vnetSiteName = "PVNodeTest";
    config.appSubnetName = "appsubnet";
    config.servicesSubnetName = "servicessubnet";
    config.dbSubnetName = "dbsubnet";

    config.deploymentName = "pvnodetestdeployment01";
    config.virualMachineName = "pvnodetestvm01";
    config.virtualNetworkName = config.vnetSiteName;
    config.storageAccountName = "mknodeteststorage01";
    config.storageLocation = config.serviceLocation;
    config.storageLabel = "pvnodeteststorage01label";
    config.storageAccountType = "Standard_LRS"; //possible values are:'Standard_LRS', 'Standard_ZRS', 'Standard_GRS', and 'Standard_RAGRS'.
    config.diskContainerName = "vhds";

    return config;
};


coreo.azure.commandLine = {
    displayHelp: function () {
        console.info("Usage: node coreo <command>\n");
        console.info("Valid commands are cloudservice, vnet, vm\n");
        console.info("Available cloud service commands:");
        console.info("create, delete <cloudServiceName>\n");
        console.info("Available vnet commands:");
        console.info("create \n");
        console.info("Available vm commands:");
        console.info("create \n");
        console.info("Available storageaccount commands:");
        console.info("list, get <accountName>, CreateIfNotExist <accountName>, delete <accountName>\n");
    }
};


coreo.azure.controller.cloudService = {
    create: function(serviceName, serviceLabel, serviceLocation)
    {
        cloudService.create(serviceName, serviceLabel, serviceLocation,
            function (err, result)
            {
                if (err) {
                    console.error(err);
                }
                else
                {
                    console.info(result);
                }
            });
    }
};
coreo.azure.controller.cloudService.delete = function(serviceName){
    cloudService.deleteAll(serviceName, function (err, result) {
        if (err)
            console.log(err);
        else
            console.log(result);
    });
};

coreo.azure.controller.networks.create = function(affinityGroupName, vnetSiteName, serviceLocation, appSubnetName, servicesSubnetName,dbSubnetName)
{
    network.createVirtualNetwork(affinityGroupName, vnetSiteName, serviceLocation, appSubnetName, servicesSubnetName,dbSubnetName,
            function (err3, result3) {
                if (err3) {
                    console.error(err3);
                } else {
                    console.info(result3);
                }
            });
};

coreo.azure.controller.storageAccount.list = function(){
    storageAccount.list(function (err, result) {
        if (err) {
            console.error(err);
        } else {
            for (var i = 0; i < result.storageAccounts.length; i++) {
                var output = result.storageAccounts[i].name + ",\n" +
                    result.storageAccounts[i].uri;
                console.info(output);
            }
        }
    });
};

coreo.azure.controller.storageAccount.get = function(name){
    storageAccount.get(name, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.info(result);
            console.info("Name: " + result.storageAccount.name + "\n");
            console.info("URI: " + result.storageAccount.uri);
        }
    });
};



coreo.azure.controller.storageAccount.createIfNotExist = function(name, location, label, accountType, callback){
    storageAccount.get(name, function (err, result) {
        if (err) {
            //storage account does not exist, create one
            var storageConfig = { name: name,
                location: location,
                label: label,
                accountType: accountType};

            storageAccount.create(storageConfig, function (err, result) {
                if (err) {
                    console.error(err);
                } else {
                    console.info("storage " + name + " created...");
                    console.info(result);
                    return callback();
                }
            });
        } else {
             //storage already exist, return
            console.info("storage account " + name + " already exist...");
            console.info(result);
            return callback();
        }
    });
};


coreo.azure.controller.storageAccount.delete = function(storageAccountName){
    storageAccount.delete(storageAccountName, function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.info(result);
        }
    });
};

coreo.azure.controller.storage.createContainerIfNotExists = function(storageAccountName, containerName, publicAccessLevel, callback){
    var blobService = new storage.blobs(storageAccountName, function(err, result){
        if(!err) {
            blobService.createContainerIfNotExists(containerName, publicAccessLevel, callback)
        }
    });

};

coreo.azure.controller.virtualMachines.create = function(){
        //create storage account if it does not exist
        console.log("Creating storage " + config.storageAccountName + " if it does not exist...");
        coreo.azure.controller.storageAccount.createIfNotExist(config.storageAccountName, config.storageLocation,
            config.storageLabel, config.storageAccountType, function(err, result)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                //TODO: create storage container if does not exist
                console.log("Creating storage container " + config.diskContainerName + " if it does not exist...");
                coreo.azure.controller.storage.createContainerIfNotExists(config.storageAccountName, config.diskContainerName, null,
                function(error, result, response) {
                    if (!error) {
                        // if result = true, container was created.
                        // if result = false, container already existed.

                        console.log("Creating VM...");
                        vms.createDeployment(config.serviceName, config.deploymentName, config.virtualNetworkName,
                            config.virualMachineName, config.storageAccountName, config.diskContainerName);
                    }
                });

            }
        });
};



//commandline arguments
if(process.argv.length < 3)
{
    throw new Error("Invalid comamndline arguments.");
}

var config = coreo.azure.controller.configuration();
var args = process.argv;

switch (args[2].toLowerCase()){
    case 'cloudservice':
        if(args[3].toLowerCase()==='create') {
            console.log("Creating cloud service " + config.serviceName);
            coreo.azure.controller.cloudService.create(config.serviceName, config.serviceLabel, config.serviceLocation);
        }
        else if(args[3].toLowerCase()==='delete') {
            if(typeof(args[4])==='undefined')
                throw new Error("CloudService Name is required for the delete command");
            else
              coreo.azure.controller.cloudService.delete(args[4]);
        }
        else {
            coreo.azure.commandLine.displayHelp();
        }
        break;
    case 'vnet':
        if(args[3].toLowerCase()==='create') {
            console.log("Creating VNET: " + config.vnetSiteName);
            coreo.azure.controller.networks.create(config.aff, config.vnetSiteName, config.serviceLocation,
                config.appSubnetName, config.servicesSubnetName, config.dbSubnetName);
        }
        break;

    case 'storageaccount':
        if(args[3].toLowerCase()==='list') {
          coreo.azure.controller.storageAccount.list();
        }
        if(args[3].toLowerCase()==='get') {
            if(typeof(args[4])==='undefined')
                throw new Error("Storage Account Name required.");
            else
                coreo.azure.controller.storageAccount.get(args[4]);
        }
        if(args[3].toLowerCase()==='create') {
            if(typeof(args[4]) != 'undefined')
            {
                coreo.azure.controller.storageAccount.createIfNotExist(args[4], config.storageLocation,
                    config.storageLabel, config.storageAccountType,
                    function(err, result){
                        if(err){console.error(err);}
                        else {console.info(result);}
                    });
            }
            else{
                coreo.azure.controller.storageAccount.createIfNotExist(config.storageAccountName, config.storageLocation,
                    config.storageLabel, config.storageAccountType, function(err, result){
                        if(err){console.error(err);}
                        else {console.info(result);}
                    });
            }
        }

        if(args[3].toLowerCase()==='delete') {
            if(typeof(args[4])==='undefined')
                throw new Error("Storage Account Name required.");
            else
                coreo.azure.controller.storageAccount.delete(args[4]);
        }
        break;
    case 'vm':
        if(args[3].toLowerCase()==='create') {
            console.log("Deploying VM: " + config.virualMachineName + " in cloud service: " + config.serviceName);
            coreo.azure.controller.virtualMachines.create();
        }
        break;

    case 'help':
        coreo.azure.commandLine.displayHelp();
        break;
    default:
        coreo.azure.commandLine.displayHelp();
}



