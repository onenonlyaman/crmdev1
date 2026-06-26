#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { Command } from 'commander';
import Table from 'cli-table3';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the server's .env file
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const require = createRequire(import.meta.url);
const models = require('../server/models/index.js');
const { sequelize } = models;

// Filter active Sequelize models
const Models = {};
for (const [key, value] of Object.entries(models)) {
  if (
    key !== 'sequelize' && 
    key !== 'Sequelize' && 
    value && 
    typeof value === 'function' && 
    value.init
  ) {
    Models[key] = value;
  }
}

// Map of prefixes for custom sequential IDs to match server controllers
const PREFIX_MAP = {
  Lead: 'LEAD',
  Opportunity: 'OPP',
  Customer: 'CUST',
  Contact: 'CON',
  Campaign: 'CMP',
  Contract: 'CONT',
  Communication: 'COMM',
  Maintenance: 'MNT',
  Organization: 'ORG',
  Note: 'NOTE',
  Task: 'TASK',
  CallLog: 'CALL',
  EmailTemplate: 'TMPL'
};

// Custom ID generator matching backend logic
async function generateNextId(Model) {
  const prefix = PREFIX_MAP[Model.name] || Model.name.substring(0, 4).toUpperCase();
  const latest = await Model.findOne({
    order: [['id', 'DESC']],
  });
  if (!latest || !latest.id || !latest.id.startsWith(prefix)) {
    return `${prefix}-0001`;
  }
  const parts = latest.id.split('-');
  const lastNum = parseInt(parts[parts.length - 1], 10);
  if (isNaN(lastNum)) {
    return `${prefix}-0001`;
  }
  const nextNum = String(lastNum + 1).padStart(4, '0');
  return `${prefix}-${nextNum}`;
}

const program = new Command();
program
  .name('crm')
  .description('CRM - Customer Relationship Management command-line interface')
  .version('1.0.0');

// Helper to convert PascalCase model names (e.g. CallLog) to kebab-case commands (e.g. call-log)
function toKebabCase(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
}

// Generate commands dynamically for each model
for (const [modelName, Model] of Object.entries(Models)) {
  const commandName = toKebabCase(modelName);
  const modelCmd = program.command(commandName).description(`Manage ${modelName} records`);

  // Helper to run DB action with automatic connection open/close
  const runAction = (fn) => async (...args) => {
    try {
      await sequelize.authenticate();
      await fn(...args);
    } catch (error) {
      console.error(`\x1b[31mError: ${error.message}\x1b[0m`);
      process.exit(1);
    } finally {
      await sequelize.close();
    }
  };

  // 1. List Command
  modelCmd.command('list')
    .description(`List ${modelName} records`)
    .option('-l, --limit <number>', 'Limit the number of records returned', '50')
    .option('-o, --offset <number>', 'Offset for pagination', '0')
    .option('-f, --filter <json>', 'JSON string for basic key-value filtering, e.g. \'{"status":"New"}\'')
    .option('--json', 'Output raw JSON format instead of a formatted table')
    .action(runAction(async (options) => {
      const limit = parseInt(options.limit, 10);
      const offset = parseInt(options.offset, 10);
      const queryOptions = { limit, offset, order: [['id', 'DESC']] };
      
      if (options.filter) {
        queryOptions.where = JSON.parse(options.filter);
      }
      
      const records = await Model.findAll(queryOptions);

      if (options.json) {
        console.log(JSON.stringify(records, null, 2));
        return;
      }

      if (records.length === 0) {
        console.log(`No records found for ${modelName}.`);
        return;
      }

      // Dynamically select columns for table: first 6 attributes, excluding system timestamps
      const attributes = Object.keys(Model.rawAttributes).filter(
        name => name !== 'createdAt' && name !== 'updatedAt'
      ).slice(0, 6);

      const table = new Table({
        head: attributes.map(a => `\x1b[36m${a}\x1b[0m`),
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
      });

      records.forEach(record => {
        table.push(attributes.map(a => record[a] !== null && record[a] !== undefined ? String(record[a]) : ''));
      });

      console.log(table.toString());
      console.log(`Total: ${records.length} records shown.`);
    }));

  // 2. Get Command
  modelCmd.command('get <id>')
    .description(`Show details of a single ${modelName} record by ID`)
    .action(runAction(async (id) => {
      const record = await Model.findByPk(id);
      if (!record) {
        console.log(`\x1b[33m${modelName} record with ID ${id} not found.\x1b[0m`);
        return;
      }
      console.log(JSON.stringify(record, null, 2));
    }));

  // 3. Create Command
  const createCmd = modelCmd.command('create')
    .description(`Create a new ${modelName} record`);

  // Dynamically attach option flags for each attribute
  const createAttributes = {};
  for (const [name, attribute] of Object.entries(Model.rawAttributes)) {
    if (name === 'id' || name === 'createdAt' || name === 'updatedAt' || name === 'createdOn') continue;
    createAttributes[name] = attribute;
    
    const flag = `--${name} <value>`;
    const isRequired = attribute.allowNull === false && attribute.defaultValue === undefined;
    const desc = attribute.comment || `The ${name} attribute`;
    
    createCmd.option(flag, isRequired ? `${desc} (Required)` : desc);
  }

  createCmd.action(runAction(async (options) => {
    // Validate required options
    for (const [name, attribute] of Object.entries(createAttributes)) {
      const isRequired = attribute.allowNull === false && attribute.defaultValue === undefined;
      if (isRequired && options[name] === undefined) {
        throw new Error(`Missing required option: --${name}`);
      }
    }

    const nextId = await generateNextId(Model);
    const createdOn = new Date().toLocaleDateString('en-IN');
    
    const data = { ...options, id: nextId, createdOn };
    const record = await Model.create(data);
    
    console.log(`\x1b[32mSuccessfully created ${modelName} record with ID ${nextId}:\x1b[0m`);
    console.log(JSON.stringify(record, null, 2));
  }));

  // 4. Update Command
  const updateCmd = modelCmd.command('update <id>')
    .description(`Update an existing ${modelName} record`);

  // Dynamically attach option flags for updates (all are optional)
  for (const [name] of Object.entries(Model.rawAttributes)) {
    if (name === 'id' || name === 'createdAt' || name === 'updatedAt' || name === 'createdOn') continue;
    updateCmd.option(`--${name} <value>`, `Update the ${name} attribute`);
  }

  updateCmd.action(runAction(async (id, options) => {
    const record = await Model.findByPk(id);
    if (!record) {
      console.log(`\x1b[33m${modelName} record with ID ${id} not found.\x1b[0m`);
      return;
    }
    
    // Filter options to only update provided flags
    const updateData = {};
    for (const key of Object.keys(options)) {
      if (options[key] !== undefined) {
        updateData[key] = options[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      console.log(`No updates provided. Use flags to update fields.`);
      return;
    }

    await record.update(updateData);
    console.log(`\x1b[32mSuccessfully updated ${modelName} record ${id}:\x1b[0m`);
    console.log(JSON.stringify(record, null, 2));
  }));

  // 5. Delete Command
  modelCmd.command('delete <id>')
    .description(`Delete a ${modelName} record by ID`)
    .action(runAction(async (id) => {
      const record = await Model.findByPk(id);
      if (!record) {
        console.log(`\x1b[33m${modelName} record with ID ${id} not found.\x1b[0m`);
        return;
      }
      await record.destroy();
      console.log(`\x1b[32mSuccessfully deleted ${modelName} record ${id}.\x1b[0m`);
    }));
}

program.parse(process.argv);
