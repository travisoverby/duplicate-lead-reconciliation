'use strict';

const path = require('path');

const environment = {
  leadsInputPath: path.join(__dirname, '../data/leads.json'),
  leadsOutputPath: path.join(__dirname, '../data/deDuplicatedLeads.json'),
};

module.exports = environment;
