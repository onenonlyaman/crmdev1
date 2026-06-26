const { Lead, Note, sequelize } = require('../models');

// Sequential ID generator matching controller logic
const generateNextId = async (Model, prefix) => {
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
    console.error(`Error generating next ID for prefix ${prefix}:`, error);
    return `${prefix}-0001`;
  }
};

const importLead = async ({ provider, campaignName, formName, leadData, io }) => {
  const transaction = await sequelize.transaction();
  try {
    const email = leadData.email ? leadData.email.trim() : null;
    const mobileNo = leadData.mobileNo ? leadData.mobileNo.trim() : null;

    let lead = null;
    let isNew = false;

    // 1. Duplicate Detection (check by email or phone)
    if (email || mobileNo) {
      const whereClause = [];
      if (email) whereClause.push({ email });
      if (mobileNo) whereClause.push({ mobileNo });

      lead = await Lead.findOne({
        where: {
          [sequelize.Sequelize.Op.or]: whereClause,
        },
        transaction,
      });
    }

    if (lead) {
      // Update existing lead
      await lead.update({
        ...leadData,
        leadSource: provider === 'google' ? 'Google Ads' : 'Meta Ads',
      }, { transaction });
    } else {
      // Create new lead
      isNew = true;
      const id = await generateNextId(Lead, 'LEAD');
      const createdOn = new Date().toLocaleDateString('en-IN');
      lead = await Lead.create({
        ...leadData,
        id,
        leadSource: provider === 'google' ? 'Google Ads' : 'Meta Ads',
        createdOn,
        status: 'New',
        priority: 'Medium',
      }, { transaction });
    }

    // 2. Timeline Activity Log (using Note table as requested)
    const noteId = await generateNextId(Note, 'NOTE');
    const createdOn = new Date().toLocaleDateString('en-IN');
    await Note.create({
      id: noteId,
      title: `Imported from ${provider === 'google' ? 'Google Ads' : 'Meta Ads'}`,
      content: `Lead automatically synchronized.\nSource: ${provider === 'google' ? 'Google Ads Lead Form' : 'Meta Lead Ad'}\nCampaign: ${campaignName || 'N/A'}\nForm: ${formName || 'N/A'}`,
      linkedId: lead.id,
      linkedType: 'Lead',
      createdOn,
      createdBy: 'System Integration',
    }, { transaction });

    await transaction.commit();

    // 3. Socket event emit
    if (io) {
      io.emit('crm:update', {
        model: 'lead',
        action: isNew ? 'create' : 'update',
        data: lead,
      });
    }

    console.log(`[LeadImporter] Successfully imported lead ${lead.id} via ${provider}.`);
    return lead;
  } catch (error) {
    await transaction.rollback();
    console.error(`[LeadImporter] Failed to import lead via ${provider}:`, error);
    throw error;
  }
};

module.exports = {
  importLead,
};
