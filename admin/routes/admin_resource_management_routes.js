import { Router } from 'express';
import { admin_resource_management_controllers } from '../controllers';

// for file upload
var multer  = require('multer');
var upload = multer({ dest: "public" + "/resource_file_uploads" });

const {
    renderViewResource,
    createResource,
    handleCreatedResource,
    individualResource,
    addResource,
    handleAddResource,
    searchResource,
    handleSearchResource,
    viewResource 

}   = admin_resource_management_controllers;

const router = Router();

router.get('/view_resource_directories', renderViewResource);
router.get('/create_resource_directories', createResource);
router.post('/create_resource_directories', handleCreatedResource);
router.get('/individual_resource', individualResource);
router.get('/add_resource_directories', addResource);
router.post('/add_resource_directories', upload.array('images', 12), handleAddResource);
router.get('/searchResource', searchResource);
router.post('/searchResource', handleSearchResource);
router.get('/viewResource', viewResource);

 
 

export default router;