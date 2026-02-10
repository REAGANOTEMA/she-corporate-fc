const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const ticketsRoutes = require('./routes/tickets');
const fansRoutes = require('./routes/fans');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/tickets', ticketsRoutes);
app.use('/api/fans', fansRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
