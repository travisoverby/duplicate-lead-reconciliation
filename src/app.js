'use strict';

const path = require('path');

const config = require(path.join(__dirname, 'config/config'));
const { loadLeads, generateLeadKey } = require(path.join(__dirname, 'lib/helpers'));

const filterDupes = (leads) => {

  const leadKeys = {};
  const outputBuilder = {};
  const output = [];

  leads.forEach(lead => {

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
      console.log(lead.email + " : " + lead._id);
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
  console.log();
  console.log("======RESULTS======");

  for (let key in outputBuilder) {
    if (outputBuilder[key]) {
      output.push(outputBuilder[key]);
    }
  }

  console.dir(output);
  
};

const main = () => {
  let leads = loadLeads(config.leadsPath);
  const output = filterDupes(leads);
};

main();