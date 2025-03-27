const express = require('express');
const NXBController = require('../controllers/publisherController.js');
const router = express.Router();

router.route('/')
    .get(NXBController.getAllNXB)  
    .post(NXBController.createNXB)     
    
router.route('/:id')
    .get(NXBController.getNXBById)
    .put(NXBController.updateNXB)   
    .delete(NXBController.deleteNXB); 

module.exports = router;