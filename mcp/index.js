import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from 'express';
import cors from 'cors';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

// Setup environment and paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from the main Express server's .env file
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const isSseMode = process.argv.includes('--sse');
const mcpApiKey = process.env.MCP_API_KEY || 'crm_mcp_secret_token_12345';

// Logging helper (Stderr for Stdio transport, Stdout for SSE)
const logInfo = (msg) => {
  if (isSseMode) {
    console.log(msg);
  } else {
    console.error(msg);
  }
};

// Import database models using CommonJS require wrapper
const require = createRequire(import.meta.url);
const models = require('../server/models/index.js');
const { sequelize } = models;

// Filter and map out Sequelize models dynamically
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

logInfo(`[MCP Server] Found ${Object.keys(Models).length} models dynamically.`);

// Helper to convert PascalCase/camelCase model names to snake_case for tool naming
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
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

// Replicate custom ID generator logic from server controllers
async function generateNextId(Model) {
  const prefix = PREFIX_MAP[Model.name] || Model.name.substring(0, 4).toUpperCase();
  try {
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
  } catch (error) {
    console.error(`Error generating next ID for model ${Model.name}:`, error);
    return `${prefix}-0001`;
  }
}

// Convert Sequelize attributes dynamically into a shape object with Zod types
function getModelZodShape(Model, isUpdate = false) {
  const shape = {};
  
  for (const [name, attribute] of Object.entries(Model.rawAttributes)) {
    // ID is skipped for Create (auto-generated) and required for Update (handled manually below)
    if (name === 'id') {
      continue;
    }
    // Skip auto-generated system fields
    if (name === 'createdAt' || name === 'updatedAt' || name === 'createdOn') {
      continue;
    }
    
    let zodType;
    const typeName = attribute.type.constructor.name;
    
    if (
      typeName.includes('INTEGER') || 
      typeName.includes('FLOAT') || 
      typeName.includes('DOUBLE') || 
      typeName.includes('DECIMAL') || 
      typeName.includes('NUMBER')
    ) {
      zodType = z.number();
    } else if (typeName.includes('BOOLEAN')) {
      zodType = z.boolean();
    } else {
      zodType = z.string();
    }
    
    // Add comment or default description
    zodType = zodType.describe(attribute.comment || `The ${name} field`);
    
    // Determine optionality
    const isOptional = isUpdate || attribute.allowNull !== false || attribute.defaultValue !== undefined;
    if (isOptional) {
      zodType = zodType.optional();
    }
    
    shape[name] = zodType;
  }
  
  return shape;
}

// Initialize MCP Server
const server = new McpServer({
  name: "Customer Relationship Management (CRM) MCP Server",
  version: "1.0.0"
});

// Dynamically build and register tools for all detected models
for (const [modelName, Model] of Object.entries(Models)) {
  const snakeName = toSnakeCase(modelName);
  
  // 1. List tool: list_<model>
  server.tool(
    `list_${snakeName}`,
    `List records for the ${modelName} module with optional limit, offset, and filtering.`,
    {
      limit: z.number().optional().default(50).describe('Limit the number of records returned (default: 50)'),
      offset: z.number().optional().default(0).describe('Offset for pagination (default: 0)'),
      filter: z.string().optional().describe('Optional JSON string for basic key-value filtering, e.g. {"status": "New"}')
    },
    async ({ limit, offset, filter }) => {
      try {
        const queryOptions = {
          limit,
          offset,
          order: [['id', 'DESC']]
        };
        if (filter) {
          queryOptions.where = JSON.parse(filter);
        }
        const records = await Model.findAll(queryOptions);
        return {
          content: [{ type: 'text', text: JSON.stringify(records, null, 2) }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error listing records: ${error.message}` }]
        };
      }
    }
  );

  // 2. Get tool: get_<model>
  server.tool(
    `get_${snakeName}`,
    `Retrieve a single ${modelName} record by its ID.`,
    {
      id: z.string().describe(`The ID of the ${modelName} record to retrieve`)
    },
    async ({ id }) => {
      try {
        const record = await Model.findByPk(id);
        if (!record) {
          return {
            isError: true,
            content: [{ type: 'text', text: `${modelName} record with ID ${id} not found.` }]
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(record, null, 2) }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error retrieving record: ${error.message}` }]
        };
      }
    }
  );

  // 3. Create tool: create_<model>
  const createShape = getModelZodShape(Model, false);
  server.tool(
    `create_${snakeName}`,
    `Create a new ${modelName} record.`,
    createShape,
    async (args) => {
      try {
        const nextId = await generateNextId(Model);
        const createdOn = new Date().toLocaleDateString('en-IN');
        const record = await Model.create({
          ...args,
          id: nextId,
          createdOn
        });
        return {
          content: [{ type: 'text', text: `Successfully created ${modelName} record:\n${JSON.stringify(record, null, 2)}` }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error creating record: ${error.message}` }]
        };
      }
    }
  );

  // 4. Update tool: update_<model>
  const updateShape = getModelZodShape(Model, true);
  // Inject ID parameter as required for updates
  updateShape.id = z.string().describe(`The unique identifier of the ${modelName} record to update`);
  
  server.tool(
    `update_${snakeName}`,
    `Update an existing ${modelName} record by ID.`,
    updateShape,
    async (args) => {
      try {
        const { id, ...updateData } = args;
        const record = await Model.findByPk(id);
        if (!record) {
          return {
            isError: true,
            content: [{ type: 'text', text: `${modelName} record with ID ${id} not found.` }]
          };
        }
        await record.update(updateData);
        return {
          content: [{ type: 'text', text: `Successfully updated ${modelName} record ${id}:\n${JSON.stringify(record, null, 2)}` }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error updating record: ${error.message}` }]
        };
      }
    }
  );

  // 5. Delete tool: delete_<model>
  server.tool(
    `delete_${snakeName}`,
    `Delete an existing ${modelName} record by ID.`,
    {
      id: z.string().describe(`The ID of the ${modelName} record to delete`)
    },
    async ({ id }) => {
      try {
        const record = await Model.findByPk(id);
        if (!record) {
          return {
            isError: true,
            content: [{ type: 'text', text: `${modelName} record with ID ${id} not found.` }]
          };
        }
        await record.destroy();
        return {
          content: [{ type: 'text', text: `Successfully deleted ${modelName} record with ID ${id}.` }]
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Error deleting record: ${error.message}` }]
        };
      }
    }
  );
}

// Runner for Stdio mode (for local AI clients like Cursor or Claude Desktop)
async function runStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logInfo('[MCP Server] Stdio transport connection running.');
}

// Runner for SSE mode (for remote/web-based AI agents, secured by token)
async function runSse() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Store active transports mapped by sessionId
  const transports = {};

  // Simple token authentication middleware
  const authenticate = (req, res, next) => {
    let token = req.query.token || req.query.apiKey;

    // Check Authorization header
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        token = parts[1];
      }
    }

    // Check custom header
    if (!token && req.headers['x-api-key']) {
      token = req.headers['x-api-key'];
    }

    if (token === mcpApiKey) {
      return next();
    }

    logInfo(`[MCP SSE] Blocked unauthorized connection attempt from ${req.ip}`);
    res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  };

  // GET /sse: Connect to Server Sent Events
  app.get('/sse', authenticate, async (req, res) => {
    logInfo('[MCP SSE] New client connection request established.');
    
    // Provide the /messages route with token pre-filled, so client messages are automatically authenticated
    const token = req.query.token || req.query.apiKey || req.headers['x-api-key'] || '';
    const postUrl = `/messages?token=${encodeURIComponent(token)}`;
    
    const transport = new SSEServerTransport(postUrl, res);
    transports[transport.sessionId] = transport;

    res.on('close', () => {
      logInfo(`[MCP SSE] Connection closed for session: ${transport.sessionId}`);
      delete transports[transport.sessionId];
    });

    await server.connect(transport);
    logInfo(`[MCP SSE] Session connected: ${transport.sessionId}`);
  });

  // POST /messages: Handle messages forwarded by the client
  app.post('/messages', authenticate, async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];

    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      logInfo(`[MCP SSE] Session ID ${sessionId} not found for incoming message`);
      res.status(400).send('No transport found for sessionId');
    }
  });

  const port = process.env.MCP_PORT || 5001;
  app.listen(port, () => {
    logInfo(`[MCP Server] SSE server running on http://localhost:${port}`);
    logInfo(`[MCP Server] Connection endpoint: http://localhost:${port}/sse?token=${mcpApiKey}`);
  });
}

// Main execution block
async function main() {
  try {
    logInfo('[MCP Server] Reconnecting to Sequelize database...');
    await sequelize.authenticate();
    logInfo('[MCP Server] Database connection established successfully.');

    if (isSseMode) {
      await runSse();
    } else {
      await runStdio();
    }
  } catch (error) {
    logInfo(`[MCP Server] Critical initialization error: ${error.message}`);
    process.exit(1);
  }
}

main();
