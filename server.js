const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors'); // import CORS 3rd party middleware
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// using CORS with corsOptions from /config/corsOptions
app.use(cors(corsOptions));

// built-in middleware to handle urlcoded data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware to serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//
// routes
//

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

app.use(verifyJWT);

app.use('/employees', require('./routes/api/employees'));

// catch all / default route
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 not found' });
  } else {
    res.type('txt').send('404 not found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
