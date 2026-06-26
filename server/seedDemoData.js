const { sequelize, Lead, Opportunity, Customer, Contact, Organization, Note, Task, CallLog } = require('./models');

const NASHIK_AREAS = ['Gangapur Road', 'College Road', 'Pathardi Phata', 'Indira Nagar', 'Govind Nagar', 'Nashik Road', 'Dwarka', 'Deolali Camp'];
const PROPERTY_TYPES = ['2 BHK Apartment', '3 BHK Luxury Apartment', '4 BHK Penthouse', 'Row House', 'Commercial Shop', 'Residential Plot'];

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Syncing database...');
    await sequelize.sync();

    // Clear existing data (except users)
    console.log('Clearing old CRM data...');
    await Lead.destroy({ where: {}, truncate: { cascade: true } });
    await Opportunity.destroy({ where: {}, truncate: { cascade: true } });
    await Customer.destroy({ where: {}, truncate: { cascade: true } });
    await Contact.destroy({ where: {}, truncate: { cascade: true } });
    await Organization.destroy({ where: {}, truncate: { cascade: true } });
    await Note.destroy({ where: {}, truncate: { cascade: true } });
    await Task.destroy({ where: {}, truncate: { cascade: true } });
    await CallLog.destroy({ where: {}, truncate: { cascade: true } });

    console.log('Seeding Nashik Real Estate Leads...');

    // 1. Leads
    const leadsData = [
      {
        id: 'LEAD-0001',
        salutation: 'Mr',
        firstName: 'Rahul',
        lastName: 'Deshmukh',
        email: 'rahul.deshmukh@gmail.com',
        mobileNo: '9822012345',
        gender: 'Male',
        organization: 'Deshmukh Agro Industries',
        website: 'www.deshmukhagro.com',
        noOfEmployees: '10-50',
        territory: 'Nashik',
        annualRevenue: 5000000.00,
        industry: 'Agriculture',
        status: 'New',
        leadOwner: 'Admin User',
        leadSource: 'Google Ads',
        jobTitle: 'Managing Director',
        propertyType: '3 BHK Luxury Apartment',
        budgetRange: '80 L - 1.2 Cr',
        preferredArea: 'Gangapur Road',
        followUpDate: '2026-06-30',
        priority: 'High',
        notes: 'Interested in a ready-to-move premium project near Gangapur Road. Prefers higher floors.'
      },
      {
        id: 'LEAD-0002',
        salutation: 'Mrs',
        firstName: 'Sneha',
        lastName: 'Patil',
        email: 'sneha.patil@outlook.com',
        mobileNo: '9552112233',
        gender: 'Female',
        organization: 'Patil Diagnostics Clinic',
        website: '',
        noOfEmployees: '1-10',
        territory: 'Nashik',
        annualRevenue: 2400000.00,
        industry: 'Healthcare',
        status: 'Follow Up',
        leadOwner: 'Admin User',
        leadSource: 'Meta Ads',
        jobTitle: 'Consulting Doctor',
        propertyType: 'Commercial Shop',
        budgetRange: '1.5 Cr - 2 Cr',
        preferredArea: 'College Road',
        followUpDate: '2026-07-02',
        priority: 'High',
        notes: 'Looking for a ground-floor commercial space on College Road for setting up a new clinic. Road-facing preferred.'
      },
      {
        id: 'LEAD-0003',
        salutation: 'Mr',
        firstName: 'Amit',
        lastName: 'Shinde',
        email: 'amit.shinde@yahoo.com',
        mobileNo: '9011223344',
        gender: 'Male',
        organization: 'Nashik IT Solutions',
        website: 'www.nashikitsolutions.com',
        noOfEmployees: '50-100',
        territory: 'Nashik',
        annualRevenue: 15000000.00,
        industry: 'Technology',
        status: 'Site Visit Scheduled',
        leadOwner: 'Admin User',
        leadSource: 'Referral',
        jobTitle: 'CEO',
        propertyType: '4 BHK Penthouse',
        budgetRange: '2 Cr - 3 Cr',
        preferredArea: 'Pathardi Phata',
        followUpDate: '2026-06-29',
        priority: 'Medium',
        notes: 'Wants a quiet villa or penthouse in Pathardi Phata. Site visit scheduled for Sunday.'
      },
      {
        id: 'LEAD-0004',
        salutation: 'Mr',
        firstName: 'Sachin',
        lastName: 'Kulkarni',
        email: 'sachin.k@rediffmail.com',
        mobileNo: '8888997766',
        gender: 'Male',
        organization: 'Kulkarni Developers',
        website: '',
        noOfEmployees: '10-20',
        territory: 'Nashik',
        annualRevenue: 8000000.00,
        industry: 'Construction',
        status: 'Negotiation',
        leadOwner: 'Admin User',
        leadSource: 'Google Ads',
        jobTitle: 'Partner',
        propertyType: 'Residential Plot',
        budgetRange: '50 L - 75 L',
        preferredArea: 'Indira Nagar',
        followUpDate: '2026-06-28',
        priority: 'Medium',
        notes: 'Looking for a clear-title residential plot in Indira Nagar for self-construction.'
      }
    ];

    for (const lead of leadsData) {
      await Lead.create(lead);
    }
    console.log('Seeded Leads.');

    // 2. Opportunities (Deals)
    const opportunitiesData = [
      {
        id: 'OPP-0001',
        title: 'Deshmukh - 3 BHK Booking',
        opportunityFrom: 'Lead',
        party: 'Rahul Deshmukh',
        status: 'Open',
        amount: 9500000,
        propertyType: '3 BHK Luxury Apartment',
        preferredArea: 'Gangapur Road',
        configuration: 'Semi-Furnished',
        budgetRange: '80 L - 1.2 Cr',
        source: 'Google Ads',
        expectedCloseDate: '2026-07-15',
        assignedTo: 'Admin User',
        priority: 'High',
        linkedLeadId: 'LEAD-0001',
        stage: 'Proposal/Price Quote',
        createdOn: '2026-06-25'
      },
      {
        id: 'OPP-0002',
        title: 'Sneha Patil - Shop Purchase',
        opportunityFrom: 'Lead',
        party: 'Sneha Patil',
        status: 'Open',
        amount: 17500000,
        propertyType: 'Commercial Shop',
        preferredArea: 'College Road',
        configuration: 'Raw Shell',
        budgetRange: '1.5 Cr - 2 Cr',
        source: 'Meta Ads',
        expectedCloseDate: '2026-08-01',
        assignedTo: 'Admin User',
        priority: 'High',
        linkedLeadId: 'LEAD-0002',
        stage: 'Qualification',
        createdOn: '2026-06-26'
      }
    ];

    for (const opp of opportunitiesData) {
      await Opportunity.create(opp);
    }
    console.log('Seeded Opportunities.');

    // 3. Customers
    const customersData = [
      {
        id: 'CUST-0001',
        customerName: 'Vijay Sonawane',
        customerGroup: 'Individual',
        territory: 'Nashik',
        contactPerson: 'Vijay Sonawane',
        email: 'vijay.sonawane@gmail.com',
        mobile: '9422255667',
        address: 'Flat 402, Shivneri Heights, Govind Nagar, Nashik - 422009',
        gstin: '',
        panNumber: 'ABCPS1234F',
        assignedTo: 'Admin User',
        status: 'Active',
        totalDeals: 1,
        totalValue: 6500000,
        createdOn: '2026-06-20'
      }
    ];

    for (const cust of customersData) {
      await Customer.create(cust);
    }
    console.log('Seeded Customers.');

    // 4. Contacts
    const contactsData = [
      {
        id: 'CON-0001',
        firstName: 'Vijay',
        lastName: 'Sonawane',
        email: 'vijay.sonawane@gmail.com',
        mobile: '9422255667',
        jobTitle: 'Senior Manager',
        company: 'MSRTC Nashik',
        status: 'Active',
        source: 'Walk-in',
        createdOn: '2026-06-20'
      }
    ];

    for (const con of contactsData) {
      await Contact.create(con);
    }
    console.log('Seeded Contacts.');

    // 5. Notes (Activity Timeline)
    const notesData = [
      {
        id: 'NOTE-0001',
        title: 'Initial Call Summary',
        content: 'Client confirmed receipt of the floor plans. Liked the Gangapur Road site layout. Requesting structural drawings next week.',
        linkedId: 'LEAD-0001',
        linkedType: 'Lead',
        createdBy: 'Admin User',
        createdOn: '2026-06-26',
        updatedOn: '2026-06-26'
      },
      {
        id: 'NOTE-0002',
        title: 'Site Visit Feedback',
        content: 'Site visit completed. Showed him flat 601 and 701. Client requested a customized payment plan spreadsheet.',
        linkedId: 'LEAD-0003',
        linkedType: 'Lead',
        createdBy: 'Admin User',
        createdOn: '2026-06-27',
        updatedOn: '2026-06-27'
      }
    ];

    for (const note of notesData) {
      await Note.create(note);
    }
    console.log('Seeded Notes.');

    // 6. Tasks
    const tasksData = [
      {
        id: 'TASK-0001',
        title: 'Send Payment Plan Proposal',
        description: 'Send custom payment structure based on construction stages for Gangapur Road 3 BHK.',
        status: 'Open',
        assignedTo: 'Admin User',
        dueDate: '2026-06-29',
        priority: 'High',
        linkedTo: 'Lead',
        linkedId: 'LEAD-0001',
        linkedType: 'Lead',
        done: false,
        createdOn: '2026-06-26'
      },
      {
        id: 'TASK-0002',
        title: 'Follow-up Call with Dr. Patil',
        description: 'Ask for feedback regarding commercial shops layout details sent on WhatsApp.',
        status: 'Open',
        assignedTo: 'Admin User',
        dueDate: '2026-07-02',
        priority: 'Medium',
        linkedTo: 'Lead',
        linkedId: 'LEAD-0002',
        linkedType: 'Lead',
        done: false,
        createdOn: '2026-06-26'
      }
    ];

    for (const task of tasksData) {
      await Task.create(task);
    }
    console.log('Seeded Tasks.');

    // 7. Call Logs
    const callLogsData = [
      {
        id: 'CALL-0001',
        to: '9822012345',
        from: '9999000011',
        duration: '3m 45s',
        status: 'completed',
        outcome: 'Interested',
        notes: 'Discussed pricing metrics. Suggested 3% cash discount on down-payment.',
        recordingUrl: '',
        linkedTo: 'Lead',
        linkedId: 'LEAD-0001',
        linkedType: 'Lead',
        callType: 'outbound',
        createdBy: 'Admin User',
        createdOn: '2026-06-26'
      }
    ];

    for (const call of callLogsData) {
      await CallLog.create(call);
    }
    console.log('Seeded Call Logs.');

    console.log('==================================================');
    console.log('DEMO DATA SEEDING COMPLETE');
    console.log('Seeded 4 Leads, 2 Opportunities, 1 Customer, 1 Contact');
    console.log('==================================================');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
};

seedData();
