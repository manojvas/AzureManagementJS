'use strict';
var computeManagement = require('./computeManagement');
var computeManagementClient = computeManagement.get();
module.exports = {
  //creates the cloud service in azure
  create: function(serviceName, label, location, callback) {
    if (serviceName === null || serviceName === undefined) {
      throw new Error('serviceName cannot be null.');
    }
    computeManagementClient.hostedServices.create({
        serviceName: serviceName,
        label: label,
        location: location
     }, callback);
   },
   
  //The deleteAll Hosted Service operation deletes the specified cloud service
  //as well as operating system disk, attached data disks, and the source
  //blobs for the disks from storage from Microsoft Azure. 
   deleteAll: function(serviceName, callback){
     computeManagementClient.hostedServices.deleteAll(serviceName, callback);
   }
};
