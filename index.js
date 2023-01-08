const express = require('express');
const app = express();

app.use(express.json());

const Datastore = require('nedb');
const db = new Datastore({ filename: 'db/datafile.db', autoload: true });

const addUser = async ({
  username,
  password,
}) => new Promise((resolve, reject) => {
  const doc = {
    username,
    password,
    active: true,
  };

  db.insert(doc, (err, doc) => {
    if (err) {
      reject(err);
    }
    resolve(doc)
  });

  return doc;
});

const loginUser = ({
  username,
  password,
}) => new Promise((resolve, reject) => {
  db.findOne({ username, password }, (err, doc) => {
    if (err) {
      reject(err);
    }

    const newDoc = {
      username: doc.username,
      password: doc.password,
      active: true,
    };

    db.update({ _id: doc._id }, newDoc, {
      multi: false,
      returnUpdatedDocs: true,
    }, (updateErr, updatedCount, updatedDoc) => {
      if (updateErr) {
        reject(updateErr);
      }
      resolve(updatedDoc)
    });
  });
});

const logoutUser = async ({
  username,
}) => new Promise((resolve, reject) => {
  db.findOne({ username }, (err, doc) => {
    if (err) {
      reject(err);
    }
    const newDoc = {
      username: doc.username,
      password: doc.password,
      active: false,
    };
  
    db.update({ _id: doc._id }, newDoc, {
      multi: false,
      returnUpdatedDocs: true,
    }, (updateErr, updatedCount, updatedDoc) => {
      if (updateErr) {
        reject(updateErr);
      }
      console.log(updatedDoc);
      resolve(updatedDoc)
    });
  });
});

const listUsers = async () => new Promise((resolve, reject) => {
  const users = db.find({}, (err, docs) => {
    if (err) {
      reject(err);
    }
    resolve(docs);
  });

  return users;
});

const listActiveUsers = async () => new Promise((resolve, reject) => {
  const users = db.find({ active: true }, (err, docs) => {
    if (err) {
      reject(err);
    }
    resolve(docs);
  });

  return users;
});


app.get('/status', function (req, res) {
  res.send('ready')
});

app.post('/register', async function (req, res) {
  const user = await addUser({
    username: req.body.username,
    password: req.body.password,
  });

  res.send(user);
});

app.post('/login', async function (req, res) {
  const user = await loginUser({
    username: req.body.username,
    password: req.body.password,
  });

  res.send(user);
});

app.post('/logout', async function (req, res) {
  const user = await logoutUser({
    username: req.body.username,
  });

  res.send(user);
});

app.get('/users', async function (req, res) {
  const users = await listUsers();

  res.send(users);
});

app.get('/active-users', async function (req, res) {
  const users = await listActiveUsers();

  res.send(users);
});

app.listen(3000);
