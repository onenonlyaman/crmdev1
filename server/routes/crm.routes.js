const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crm.controller');

// Helper to define standard CRUD routes
const setupCrudRoutes = (path, controller) => {
  router.get(path, controller.getAll);
  router.get(`${path}/:id`, controller.getById);
  router.post(path, controller.create);
  router.put(`${path}/:id`, controller.update);
  router.delete(`${path}/:id`, controller.delete);
};

// Mount CRM entities
setupCrudRoutes('/leads', crmController.leads);
setupCrudRoutes('/opportunities', crmController.opportunities);
setupCrudRoutes('/customers', crmController.customers);
setupCrudRoutes('/contacts', crmController.contacts);
setupCrudRoutes('/campaigns', crmController.campaigns);
setupCrudRoutes('/contracts', crmController.contracts);
setupCrudRoutes('/communications', crmController.communications);
setupCrudRoutes('/maintenance', crmController.maintenances);
setupCrudRoutes('/organizations', crmController.organizations);
setupCrudRoutes('/notes', crmController.notes);
setupCrudRoutes('/tasks', crmController.tasks);
setupCrudRoutes('/call-logs', crmController.callLogs);
setupCrudRoutes('/email-templates', crmController.emailTemplates);

module.exports = router;
