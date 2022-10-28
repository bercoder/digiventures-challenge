require('dotenv').config();
const mongoose = require('mongoose');

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('👌')
}).catch(error => console.error(error))

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception:', err);
});

module.exports = mongoose;