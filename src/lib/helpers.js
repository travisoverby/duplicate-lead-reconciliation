'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const config = require(path.join(__dirname, '../config/config'));
const logger = require(path.join(__dirname, '../config/winston'));

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
  logger.info("Loading initial batch of leads");

  let leads = fs.readFileSync(leadsPath);
  leads = JSON.parse(leads);
  logger.info("Raw leads object loaded");
  logger.info(leads);
  
  return leads.leads;
};

const writeLeads = (writePath, leads) => {
  logger.info("De-duplication complete");

  const output = { leads: leads };
  logger.info(output);

  fs.writeFileSync(writePath, JSON.stringify(output));
};

const handleDuplicateLead = (key, lead, leadKeys, outputBuilder) => {
  if (key) {
    logger.info("Lead key found")

    if (outputBuilder[key]) {
      logger.info("Checking current lead date against old lead date")
      const oldLead = outputBuilder[key];

      if (lead.entryDate >= oldLead.entryDate) {
        logger.info("Replacing old lead with new lead");
        logger.info("Old lead");
        logger.info(oldLead);

        outputBuilder[key] = null;
        leadKeys[oldLead._id] = null;
        leadKeys[oldLead.email] = null;

        const newKey = generateLeadKey(lead._id, lead.email);
        leadKeys[lead._id] = newKey;
        leadKeys[lead.email] = newKey;

        outputBuilder[newKey] = lead;
        logger.info("Replacement lead");
        logger.info(lead);
      }

    }

  }
};

const handleNewLead = (lead, leadKeys, outputBuilder) => {
  if (!leadKeys[lead._id] && !leadKeys[lead.email]) {
    logger.info("Lead not found in outputBuilder. Adding lead to builder");

    const key = generateLeadKey(lead._id, lead.email);
    logger.info("Generating key from lead._id and lead.email");
    logger.info("Key: " + key);

    leadKeys[lead._id] = key;
    leadKeys[lead.email] = key;

    outputBuilder[key] = lead;
    logger.info("Saving lead to outputBuilder");
    logger.info(lead);
  }
}

module.exports = {
  loadLeads,
  writeLeads,
  handleDuplicateLead,
  handleNewLead
};