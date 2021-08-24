const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

const geojson = {
  '1': require('./data/bishop.json'),
  '2': require('./data/kern.json'),
  '3': require('./data/la.json'),
  '4': require('./data/sf.json'),
};

const existing = require('./existing.json');

app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api/existing", (req, res) => {
  res.json(existing['projects']);
});

app.get("/api/geojson/:project", (req, res) => {

  if(req.params.project in geojson) {
    res.json(geojson[req.params.project]);
  }
  else {
    res.json({});
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
