import { Res_utils } from '../utils';
import { admin_resource_management_queries } from '../queries';

// require the path module
var path = require("path");



const {
  resError, resPopupRedirect, resRedirect,
} = Res_utils;

const {
  createDirectory,
  getResources,
  addNewResource,
  searchResourceDetails
} = admin_resource_management_queries;




/**
*@class admin_resource_management_controllers
*@description Controllers for handling the resources upload section



*@exports admin_resource_management_controllers
*/
class admin_resource_management_controllers {


  /**
   * @name renderViewResource
   * @description renders the page allowing an admin to view all the resources available
   */


  static async renderViewResource(req, res) {
    try {
      const { capabilityIds } = req.session;

      var resources = await getResources() 

      return res.render ('fmda_admin/resourcesUpload/render_resources', { data: resources, capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  };

  static async createResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render ('fmda_admin/resourcesUpload/create_resources', { capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  };

  static async handleCreatedResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      var adminId = req.session.officialEmail //"agbajepaul@yahoo.com"//; 
      var list_of_accessors = [];
      //list_of_accessors.push(req.body.Accessor);
      var checkboxes = req.body.Accessor;

      
      const variables = {
        "directoryName": req.body.title ,
        "accessors": req.body.Accessor,//list_of_accessors[0],
        "description": req.body.Description,
        "createdBy": adminId
      };

      const newDirectory = await createDirectory(variables, adminId);
      if (newDirectory.statusCode === 200) {
        return resPopupRedirect(res, newDirectory.message, `/admin/resource_management/view_resource_directories`);
      }
      return resPopupRedirect(res, newDirectory.message, `/admin/resource_management/view_resource_directories`);
    } catch (error) {
      return resError(res, error);
    }
  };

  static async individualResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      var id = req.query.id;
      req.session.resource_id = id

      var [resources, resource_details] = await Promise.all([getResources(), searchResourceDetails(id)])  

      var resource =  resources.filter(function(resource) {
        return resource.id == req.query.id;
        
      });

      
      resource = resource[0]

      return res.render ('fmda_admin/resourcesUpload/individaul_resource', { data: resource, list: resource_details, capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  };

  static async addResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render ('fmda_admin/resourcesUpload/add_resources', { capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  }
  
  static async handleAddResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      var adminId = req.session.officialEmail //"agbajepaul@yahoo.com"//; 
      var list_of_accessors = [];
      list_of_accessors.push(req.body.Accessor);
      var id = req.session.resource_id; // why did this not store the value i was looking for
      
      var uploadArray = req.files;

      for (let index = 0; index < uploadArray.length; index++) {
        const resource = uploadArray[index];

        // check that the event resource was uploaded
        if (resource) {
          // get the picture extension
          var fileExt = path.extname(path.join(__dirname) + "/public/resource_file_uploads/" + resource.originalname.replace("","%20") );

          //var url = '/admin/resource_management/searchResource'//path.dirname(resource);

          var url = "resource_file_uploads/"+resource.filename;

          // put into array
          //event_pics_array.push(imagePlusPath);


          }
      }



      
      const variables = {
        "name": req.body.name,
        "url":  url,
        "format": fileExt,
        "directoryId": id,//req.query.id,
        "accessors": req.body.Accessor,//list_of_accessors[0],
        "createdBy": adminId
      };


      const newResource = await addNewResource(variables, adminId);
      if (newResource.statusCode === 200) {
        return resPopupRedirect(res, newResource.message, `/admin/resource_management/view_resource_directories`);
      }
      return resPopupRedirect(res, newResource.message, `/admin/resource_management/view_resource_directories`);
    } catch (error) {
      return resError(res, error);
    }
  };


  static async searchResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render ('fmda_admin/resourcesUpload/search_resources', { capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  };


  static async handleSearchResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      var id = req.body.id;

      var resource_details = await searchResourceDetails(id);
      req.session.resource_details = resource_details;
      
      return res.redirect("/admin/resource_management/viewResource")

      //if (resource_details.statusCode === 200) {
      // if (typeof resource_details == 'string') {
      //   return res.redirect("/admin/resource_management/viewResource")
      // } else {
      //   return res.redirect("/admin/resource_management/searchResource")
      // }
        // return resPopupRedirect(res, resource_details.message, `/admin/resource_management/viewResource`);
      //}
      //return res.redirect("/admin/resource_management/searchResource")
      // return resPopupRedirect(res, resource_details.message, `/admin/resource_management/searchResource`);

    } catch (error) {
      return resError(res, error);
    }
  };

  static async viewResource(req, res) {
    try {
      const { capabilityIds } = req.session;
      var data = req.session.resource_details;
      var data = data[0];
      return res.render ('fmda_admin/resourcesUpload/viewResource', { data, capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  };

}

export default admin_resource_management_controllers;
