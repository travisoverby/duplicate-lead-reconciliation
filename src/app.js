'use strict';

const path = require('path');

const config = require(path.join(__dirname, 'config/config'));
const { loadLeads, handleDuplicateLead, handleNewLead } = require(path.join(__dirname, 'lib/helpers'));
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

const deconstructOutput = (outputBuilder) => {
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
  logger.info("Loading initial batch of leads....");
  let leads = loadLeads(config.leadsPath);
  logger.info(leads);
  const outputBuilder = filterDupes(leads);
  const output = deconstructOutput(outputBuilder);

  logger.info("De-duplication complete");
  logger.info(output);

  console.dir(output);
};

main();