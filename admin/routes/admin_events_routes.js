import { Router } from 'express';
import { Admin_events_controllers } from '../controllers';

// for file upload
var multer  = require('multer');
var upload = multer({ dest: "public" + "/events_pics_uploads" });

const {
  renderCreateEventPage,
  picture_upload,
  event_types,
  handleCreateEvent,
  renderManageEventsPage,
  renderEventDetailsPage,
  renderEventAttendeesPage,
  handlePublishEvent,
  handleUnpublishEvent,
  renderUnpublishedDetailsPage,
  updatepictureUpload,
  renderUnpublishedDetailsPagetwo,
  handleUnpublishedDetailsPage
} = Admin_events_controllers;

const router = Router();

router.get('/create', renderCreateEventPage);
router.post('/picture_upload', upload.array('images', 12), picture_upload);
router.get('/create_event2', event_types);
router.post('/create', handleCreateEvent);
router.get('/manage', renderManageEventsPage);
router.get('/details', renderEventDetailsPage);
router.get('/attendees', renderEventAttendeesPage);
router.get('/publish', handlePublishEvent);
router.get('/unpublish', handleUnpublishEvent);
router.get('/detailsUpdate', renderUnpublishedDetailsPage);
router.get('/detailsUpdate2', renderUnpublishedDetailsPagetwo);
router.post('/updatepicture_upload', upload.array('images', 12), updatepictureUpload);
router.post('/detailsUpdate', handleUnpublishedDetailsPage);


export default router;
