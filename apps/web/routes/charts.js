const express = require('express');
const moment = require('moment');

const {
  Task,
  Server
} = require('../../../models');

const chartsRouter = express.Router();

chartsRouter.get('/monitor/:date', async (req, res) => {
  try {
    const start = moment(req.params.date);
    const end = moment(req.params.date).add(1, 'days');
    const servers = (await Server.find({})).map(server => ({id: server._id, name: server.name, complete: []}));
    const labels = [];
    for (; start < end; start.add(1, 'hours')) {
      const date = {
        $gte: start.format('YYYY-MM-DD HH:00:00'),
        $lte: start.format('YYYY-MM-DD HH:59:59'),
      };
      labels.push(start.format('HH:mm'));
      for (let i = 0; i < servers.length; i++)
      {
        const complete = await Task.countDocuments({
            serverId: servers[i].id,
            date,
            isComplete: true,
        });
        servers[i].complete.push(complete);
      }
    }  
    
    res.json({
      tasks: {
        labels,
        servers,
      },
    });  
  } catch (err) {
    console.log(err);
    res.json({
      tasks: {
        labels: [],
        servers: [],
      },
    });
  }
})

chartsRouter.get('/:serverId', async (req, res) => {
  try {
    const serverId = req.params.serverId;
    const end = moment();
    const start = moment().subtract(30, 'days');
    const labels = [];
    const complete = [];
    const notComplete = [];
    for (; start <= end; start.add(1, 'days')) {
      const date = {
        $gte: start.format('YYYY-MM-DD 00:00:00'),
        $lte: start.format('YYYY-MM-DD 23:59:59'),
      };
      labels.push(start.format('DD.MM'));
      complete.push(await Task.countDocuments({
        serverId,
        date,
        isComplete: true,
      }));
      notComplete.push(await Task.countDocuments({
        serverId,
        date,
        isComplete: false,
      }));
    }
    res.json({
      tasks: {
        labels,
        complete,
        notComplete,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({
      tasks: {
        labels: [],
        complete: [],
        notComplete: [],
      },
    });
  }
});
module.exports = {
  chartsRouter,
};
