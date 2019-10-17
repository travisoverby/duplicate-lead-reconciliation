'use strict';

const path = require('path');

const config = require(path.join(__dirname, 'config/config'));
const { loadLeads, generateLeadKey } = require(path.join(__dirname, 'lib/helpers'));
const logger = require(path.join(__dirname, 'config/winston'));

const filterDupes = (leads) => {

  const leadKeys = {};
  const outputBuilder = {};

  leads.forEach(lead => {
    logger.info("Current lead");
    logger.info(lead);
    
    if (leadKeys[lead._id]) {
      let idKey = leadKeys[lead._id];
      if (outputBuilder[idKey]) {
        const oldLead = outputBuilder[idKey];
        if (lead.entryDate >= oldLead.entryDate) {
          outputBuilder[idKey] = null;
          leadKeys[oldLead._id] = null;
          leadKeys[oldLead.email] = null;

          idKey = generateLeadKey(lead._id, lead.email);
          leadKeys[lead._id] = idKey;
          leadKeys[lead.email] = idKey;

          outputBuilder[idKey] = lead;
        }
      }
    }

    if (leadKeys[lead.email]) {
      let emailKey = leadKeys[lead.email];
      if (outputBuilder[emailKey]) {
        const oldLead = outputBuilder[emailKey];
        if (lead.entryDate >= oldLead.entryDate) {
          outputBuilder[emailKey] = null;
          leadKeys[oldLead._id] = null;
          leadKeys[oldLead.email] = null;

          emailKey = generateLeadKey(lead._id, lead.email);
          leadKeys[lead._id] = emailKey;
          leadKeys[lead.email] = emailKey;

          outputBuilder[emailKey] = lead;
        }
      }
    }

    if (!leadKeys[lead._id] && !leadKeys[lead.email]) {
      const key = generateLeadKey(lead._id, lead.email);
      leadKeys[lead._id] = key;
      leadKeys[lead.email] = key;

      outputBuilder[key] = lead;
    }

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