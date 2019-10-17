# Duplicate Lead Reconciliation

### Installation instructions

* Navigate to a directory via terminal where you would like to clone the project
* Run the command `git clone git@github.com:travisoverby/duplicate-lead-reconciliation.git`
* `cd` into the `duplicate-lead-reconciliation` directory
* Run the command `npm install --save` to install dependencies
* Run the command `npm start` to run program

### High level application overview

Per the instructions, this is a small, command-line application to de-duplicate a list of JSON leads.

Each lead has two key fields -- an `id` field, and an `email` field. If a lead with a duplicate `id` or `email` is found and it has a newer `entryDate` timestamp, the old lead is removed from the list.

### Method

* For each lead, we generate a unique `key` value by hashing the `id` and `email` fields together. This `key` is stored in a Javascript object for fast look-ups.
* When a new lead is found, we check the `leadKeys` object to see if a key exists for the `id` or `email` field.
* If a `key` exists, we check to determine if a valid lead is attached to the given `key`
* If a valid lead is found, this "old" lead's `entryDate` is compared against the new lead's `entryDate`. 
* If the new lead's entryDate is greater-than-or-equal-to the old lead's entry date, the lead attached to the `key` is invalidated, a new `key` is generated, and the new lead is stored as a value of the new `key`


### Time/Space Complexity

* Initial list of leads is only iterated over once, with no look-backs. **O(N) time complexity**
* `leadKeys` object keeps track of seen `id`/`email` attributes
* `outputBuilder` object stores list of final, valid, non-duplicate leads
* Two keys per lead (one for `id`, one for `email`), plus potentially one entry in `outputBuilder` per input lead. **O(N) space complexity**