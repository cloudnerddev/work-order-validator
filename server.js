// server.js - Simple Express server for work order validation
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// Store valid work orders (in a real app, this would be in a database)
// You can modify this array to include your valid work order numbers
let validWorkOrders = [
  'WO-12345',
  'WO-67890',
  'WO-54321',
  'WO-09876'
];

// Endpoint to check if a work order is valid
app.get('/validate/:workOrderNumber', (req, res) => {
  const workOrderNumber = req.params.workOrderNumber;
  const isValid = validWorkOrders.includes(workOrderNumber);
  
  res.json({ 
    valid: isValid,
    workOrderNumber: workOrderNumber
  });
});

// POST endpoint to add new valid work orders
app.post('/admin/work-orders', (req, res) => {
  const { workOrderNumber, apiKey } = req.body;
  
  // Simple API key validation (in production, use a more secure method)
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (!workOrderNumber) {
    return res.status(400).json({ error: 'Work order number is required' });
  }
  
  // Add the work order if it doesn't already exist
  if (!validWorkOrders.includes(workOrderNumber)) {
    validWorkOrders.push(workOrderNumber);
    return res.status(201).json({ 
      message: 'Work order added successfully',
      workOrderNumber: workOrderNumber
    });
  } else {
    return res.json({ 
      message: 'Work order already exists',
      workOrderNumber: workOrderNumber
    });
  }
});

// GET endpoint to list all valid work orders
app.get('/admin/work-orders', (req, res) => {
  const { apiKey } = req.query;
  
  // Simple API key validation
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json({ workOrders: validWorkOrders });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
