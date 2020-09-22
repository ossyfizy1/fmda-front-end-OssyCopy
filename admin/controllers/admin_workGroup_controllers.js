import { Res_utils } from '../utils';
import { Admin_workGroup_queries } from '../queries';

// require the path module
var path = require("path");



const {
  resError, resPopupRedirect, resRedirect,
} = Res_utils;

const {
  validateWorkGroup,
  addmember,
  lookUpWorkGroup,
  listOfWorkGroups,
  addParticipant
} = Admin_workGroup_queries;




/**
*@class Admin_workGroup_controller
*@description Controllers for handling verification and approval of payments

// come back to rename this

*@exports Admin_workGroup_controller
*/
class Admin_workGroup_controller {

  /**
   * @name renderCreateworkGroupPage
   * @description renders the page allowing an admin to create a new work group
   */


  static async renderWorkGroupPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render ('fmda_admin/workGroup/create_workGroup', { capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateEvent
   * @description  handles the creation of a work group
   */

  static async detailsUpload(req, res) {
    try{
      if (typeof (req.body.title) == 'string') {
          var variables =  {        
            "adminId": req.session.officialEmail,
            "groupName": req.body.title,
            "groupSubject": req.body.description,
            "groupAdminMemberUUID": req.body.groupid
        }
  // do we have to generate the group id uuid
      }
      const createWorkGroup = await validateWorkGroup(variables);
      if (createWorkGroup.statusCode === 200) {
        return resPopupRedirect(res,createWorkGroup.message, '/admin/workGroup/create_work_group');  
      }
      return resPopupRedirect(res,createWorkGroup.message, '/admin/workGroup/create_work_group');  
      

    } catch (error) {
      return resError(res, error);
    }

    //req.session.event_param1 = event_param1
    

  }

  /**
   * @name handleCreateEvent
   * @description  handles the addtion of a member to a work group
   */

  static async getListOfworkGroups(req, res) {
    try {
      const { capabilityIds } = req.session
    const groupList = await listOfWorkGroups() 
    return  res.render('fmda_admin/workGroup/workGroup_members', { data: groupList, action: 'view', capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateEvent
   * @description  handles the addtion of a member to a work group
   */

  static async renderMemberAddPage(req, res) {
    try {
      const { capabilityIds } = req.session

      const id = req.query.id
      
      let groups = await listOfWorkGroups();
        
      var group =  groups.filter(function(group) {
        return group.id == req.query.id;
        
      });
      group = group[0]
      

     return   res.render('fmda_admin/workGroup/addMember', { capabilityIds, group})
    } catch (error) {
      return resError(res, error);
    }
  }

    /**
   * @name handleCreateEvent
   * @description  handles the addtion of a member to a work group
   */

  static async viewParticipants(req, res) {
    try {
      const { capabilityIds } = req.session

      const id = req.query.id
      
      let groups = await listOfWorkGroups();
        
      var group =  groups.filter(function(group) {
        return group.id == req.query.id;
        
      });
      group = group[0]
      

     return   res.render('fmda_admin/workGroup/viewParticipants', { capabilityIds, group})
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateEvent
   * @description  handles the addition of a member to a work group
   */

  static async memberAddDetails(req, res) {
    try {
      const { capabilityIds } = req.session;
      if (typeof (req.body.title) == 'string') {
        var variables =  {        
          //"adminId": req.session.officialEmail,
          "adminId": "agbajepaul@yahoo.com", // this line is for the purpose of testing only
          "groupName": req.body.title,
          "groupSubject": req.body.description,
          "groupAdminMemberUUID": req.body.groupid
      }
// do we have to generate the group id uuid
    }

    const createMember = await addmember(variables);
    if (createMember.statusCode === 200) {
      return resRedirect(res, '/admin/workGroup/view_groupMemberAddPage');
    }
    return resPopupRedirect(res, createMember.message, '/admin/workGroup/view_groupMemberAddPage');  
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateEvent
   * @description  handles the search of a member to a work group
   */

  static async renderLookUpMemberPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render ('fmda_admin/workGroup/lookUpMemberPage', { capabilityIds })
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateEvent
   * @description  handles the addtion of a member to a work group
   */

  static async LookUpMemberAddDetails(req, res) {
    try {
      const { capabilityIds } = req.session;
      var memberId = req.body.groupid

      const membergroups = await lookUpWorkGroup(memberId);
      // if (typeof membergroups[0] != '' ||  'undefined') {
      //  return res.render('fmda_admin/workGroup/memberGroups', { capabilityIds, membergroups });

      // }  else {
      // return resPopupRedirect(res, 'no ID matches', '/admin/workGroup/view_groupMemberAddPage'); 
      // }
      console.log(membergroups)
      if (membergroups[0] == ''){
        return resPopupRedirect(res, 'no ID matches', '/admin/workGroup/view_groupMemberAddPage') 
      }
      else if (typeof membergroups == 'undefined') {
        return resPopupRedirect(res, 'no ID matches', '/admin/workGroup/view_groupMemberAddPage'); 
      }
      else {
        return res.render('fmda_admin/workGroup/memberGroups', { capabilityIds, membergroups });
      }

    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateEvent
   * @description  handles the addtion of a member to a work group
   */

  static async addMemberToGroup(req, res) {
    try {
      const { capabilityIds } = req.session;
      var memberId = req.query.id
      var variables =  {     
      "workgroupId": memberId,
      "groupAdminId": req.body.groupid,
      "memberUUID": req.body.memberUUID,
      "isAdmin": req.body.boolean
    } 
      const memberadd = await addParticipant(variables);
      if (memberadd.statusCode === 200) {
        return resRedirect(res, '/admin/workGroup/add_member_to_work_group');
      }
      return resPopupRedirect(res, memberadd.message, '/admin/workGroup/add_member_to_work_group');  

    } catch (error) {
      return resError(res, error);
    }
  }


  

}

export default Admin_workGroup_controller;
