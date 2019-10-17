'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const config = require(path.join(__dirname, '../config/config'));

const hash = (str) => {
  if (typeof(str) === 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', "this is a secret").update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

const generateLeadKey = (id, email) => {
  return hash(id + '_' + email);
};

const loadLeads = (leadsPath) => {
  const leads = fs.readFileSync(leadsPath);
  
  return JSON.parse(leads).leads;
};

module.exports = {
  hash,
  generateLeadKey,
  loadLeads
};