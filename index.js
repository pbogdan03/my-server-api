const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const Data = require('./massageData');
const TIMER_DATA_FILE = path.join(__dirname, 'timer-data.json');
const VOTING_DATA_FILE = path.join(__dirname, 'voting-data.json');

const app = express();

app.set('port', (process.env.PORT || 3000));

const whitelist = ['https://bogdanp.gitlab.io', 'http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted)
  },
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/timers', (req, res) => {
  fs.readFile(TIMER_DATA_FILE, (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post('/api/timers', (req, res) => {
  fs.readFile(TIMER_DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    const newTimer = {
      title: req.body.title,
      project: req.body.project,
      id: req.body.id,
      elapsed: 0,
      runningSince: null,
    };
    timers.push(newTimer);
    fs.writeFile(TIMER_DATA_FILE, JSON.stringify(timers, null, 4), () => {
      res.json(timers);
    });
  });
});

app.post('/api/timers/start', (req, res) => {
  fs.readFile(TIMER_DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    timers.forEach((timer) => {
      if (timer.id === req.body.id) {
        timer.runningSince = req.body.start;
      }
    });
    fs.writeFile(TIMER_DATA_FILE, JSON.stringify(timers, null, 4), () => {
      res.json({});
      res.end();
    });
  });
});

app.post('/api/timers/stop', (req, res) => {
  fs.readFile(TIMER_DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    timers.forEach((timer) => {
      if (timer.id === req.body.id) {
        const delta = req.body.stop - timer.runningSince;
        timer.elapsed += delta;
        timer.runningSince = null;
      }
    });
    fs.writeFile(TIMER_DATA_FILE, JSON.stringify(timers, null, 4), () => {
      res.json({});
      res.end();
    });
  });
});

app.put('/api/timers', (req, res) => {
  fs.readFile(TIMER_DATA_FILE, (err, data) => {
    const timers = JSON.parse(data);
    timers.forEach((timer) => {
      if (timer.id === req.body.id) {
        timer.title = req.body.title;
        timer.project = req.body.project;
      }
    });
    fs.writeFile(TIMER_DATA_FILE, JSON.stringify(timers, null, 4), () => {
      res.json({});
      res.end();
    });
  });
});

app.delete('/api/timers', (req, res) => {
  fs.readFile(TIMER_DATA_FILE, (err, data) => {
    let timers = JSON.parse(data);
    timers = timers.reduce((memo, timer) => {
      if (timer.id === req.body.id) {
        return memo;
      } else {
        return memo.concat(timer);
      }
    }, []);
    fs.writeFile(TIMER_DATA_FILE, JSON.stringify(timers, null, 4), () => {
      res.json({});
      res.end();
    });
  });
});

app.get('/api/voting', (req, res) => {
  Data.renewVotingData(() => {
    fs.readFile(VOTING_DATA_FILE, (err, data) => {
      res.json(JSON.parse(data));
    });
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
