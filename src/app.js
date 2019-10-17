'use strict';

const path = require('path');

const config = require(path.join(__dirname, 'config/config'));
const { loadLeads, writeLeads, handleDuplicateLead, handleNewLead } = require(path.join(__dirname, 'lib/helpers'));
const logger = require(path.join(__dirname, 'config/winston'));


const filterDupes = (leads) => {
  const leadKeys = {};
  const outputBuilder = {};

  leads.forEach(lead => {
    logger.info("Current lead");
    logger.info(lead);

    const leadIDKey = leadKeys[lead._id];
    const leadEmailKey = leadKeys[lead.email];

    handleDuplicateLead(leadIDKey, lead, leadKeys, outputBuilder);
    handleDuplicateLead(leadEmailKey, lead, leadKeys, outputBuilder);

    handleNewLead(lead, leadKeys, outputBuilder);

  });
  
  return outputBuilder;
  
};

const deconstructOutputBuilder = (outputBuilder) => {
  const output = [];

  for (const key in outputBuilder) {
    const lead = outputBuilder[key];
    if (lead) {
      output.push(lead);
    }
  }

  return output;
};

const main = () => {
  const rawLeads = loadLeads(config.leadsInputPath);

  const outputBuilder = filterDupes(rawLeads);
  const leads = deconstructOutputBuilder(outputBuilder);

  writeLeads(config.leadsOutputPath, leads);

  console.dir(leads);
};

main();