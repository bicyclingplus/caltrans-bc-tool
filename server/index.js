const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const tool = express();
const morgan = require('morgan');
require('dotenv').config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

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

tool.get("/api/bounds", async (req, res) => {

    let query = {
    };

    // filter by map bounds if needed
    if(req.query.x1 && req.query.x2 && req.query.y1 && req.query.y2) {

      let x1 = parseFloat(req.query.x1);
      let x2 = parseFloat(req.query.x2);
      let y1 = parseFloat(req.query.y1);
      let y2 = parseFloat(req.query.y2);

      query.geometry = {
        "$geoIntersects": {
          "$geometry": {
            "type": "Polygon",
            "coordinates": [[
              [x1, y1],
              [x1, y2],
              [x2, y2],
              [x2, y1],
              [x1, y1],
            ]]
          },
        },
      };
    }

    // Connect the client to the server
    await client.connect();

    const database = client.db('bctool');
    const features = database.collection('features');

    const result = await features.find(query).toArray();

    res.json({
      "type": "FeatureCollection",
      "features": result,
    });
});

app.use('/caltrans-bc-tool', tool);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
