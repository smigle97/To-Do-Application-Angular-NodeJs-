const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const fs = require('fs');


app.get('/tasks', (req, res) => {
    try {
      // Read tasks from file
      const tasksData = fs.readFileSync('tasks.json');
      const tasks = JSON.parse(tasksData);
      console.log(tasks);
      
      // Send tasks as JSON response
      res.json(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.put('/tasks', (req, res) => {
  // Write tasks to file
  fs.writeFileSync('tasks.json', JSON.stringify(req.body));
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});