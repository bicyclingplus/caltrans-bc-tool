const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const tool = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
require('dotenv').config();

const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);

app.use(morgan('combined'));
app.use(bodyParser.json())

tool.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route


// this endpoint takes in the corners of a latlng bounding box
// the corners of the bounding box are then transformed into a geojson polygon
// and used to query for ways/intersections that intersect the polygon
// we need all four url paramters and the two latlngs must be different
//
// y1, x1 is the latlng for the south west corner of the bounding box
// y2, x2 is the latlng for north east corner of the bounding box
//
// y1 = South latitude
// x1 = West longitude
//
// y2 = North latitude
// x2 = East longitude
//
// The polygon is then defined with 5 points A, B, C, D, A
// A (x1, y1) South West corner
// B (x1, y2) North West corner
// C (x2, y2) North East corner
// D (y2, y1) South East corner
// A (x1, y1) Back to the SW corner to close the polygon
tool.get("/api/bounds", async (req, res) => {
  if(!req.query.x1 || !req.query.x2 || !req.query.y1 || !req.query.y2) {
    return res.status(400).send({ "error": "All four bounding box coordinates (x1, y1, x2, and y2) are required."});
  }

  let x1 = parseFloat(req.query.x1);
  let x2 = parseFloat(req.query.x2);
  let y1 = parseFloat(req.query.y1);
  let y2 = parseFloat(req.query.y2);

  if(isNaN(x1) || x1 > 180 || x1 < -180) {
    return res.status(400).send({ "error": "Parameter x1 is invalid longitude"});
  }

  if(isNaN(x2) || x2 > 180 || x2 < -180) {
    return res.status(400).send({ "error": "Parameter x2 is invalid longitude"});
  }

  if(isNaN(y1) || y1 > 90 || y1 < -90) {
    return res.status(400).send({ "error": "Parameter y1 is invalid latitude"});
  }

  if(isNaN(y2) || y2 > 90 || y2 < -90) {
    return res.status(400).send({ "error": "Parameter y2 is invalid latitude"});
  }

  if(x1 === x2 && y1 === y2) {
    return res.status(400).send({ "error": "SW and NE Bounding box corners must be different."});
  }

  let query = {
    "geometry": {
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
    }
  };

    try {
    // Connect the client to the server
    await client.connect();

    const database = client.db('bctool');

    let collection = database.collection('ways');
    const ways = await collection.find(query).toArray();

    collection = database.collection('intersections');
    const intersections = await collection.find(query).toArray();

    res.json({
      "ways": {
        "type": "FeatureCollection",
        "features": ways,
      },
      "intersections": {
        "type": "FeatureCollection",
        "features": intersections,
      }
    });
  }
  finally {
    await client.close();
  }

});

tool.get('/api/projects/:projectId', async (req, res) => {

  try {

    await client.connect();

    const database = client.db('bctool');
    const collection = database.collection('projects');

    let project = await collection.findOne({
      '_id': new ObjectId(req.params.projectId),
    });

    if(project) {
      return res.json(project);
    }

    return res.status(404).json({
      'message': 'Project not found',
    });
  }
  finally {
    await client.close();
  }

});

tool.post('/api/projects', async (req, res) => {

  try {

    await client.connect();

    const database = client.db('bctool');
    const collection = database.collection('projects');

    let project = await collection.insertOne(req.body);

    return res.json({
      'message': 'Project added successfully',
      'id': project.insertedId,
    });
  }
  finally {
    await client.close();
  }

});

app.use('/', tool);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
