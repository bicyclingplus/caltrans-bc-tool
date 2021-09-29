const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const tool = express();
const morgan = require('morgan');

const geojson = {
  '1': require('./data/bishop.json'),
  '2': require('./data/kern.json'),
  '3': require('./data/la.json'),
  '4': require('./data/sf.json'),
};

const existing = require('./data/existing.json');

app.use(morgan('combined'));

tool.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
tool.get("/api/existing", (req, res) => {
  res.json(existing['projects']);
});

tool.get("/api/geojson/:project", (req, res) => {

  if(req.params.project in geojson) {
    res.json(geojson[req.params.project]);
  }
  else {
    res.json({});
  }
});

app.use('/caltrans-bc-tool', tool);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
