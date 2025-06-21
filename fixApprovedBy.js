import { MongoClient } from 'mongodb';

async function fixApprovedBy() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set.');
    process.exit(1);
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); // Use the 'test' database
    const vendors = db.collection('vendors');
    const cursor = vendors.find({ approvedBy: { $exists: true, $not: { $size: 0 } } });
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const fixed = (doc.approvedBy || []).map(String);
      await vendors.updateOne({ _id: doc._id }, { $set: { approvedBy: fixed } });
    }
    console.log('All approvedBy values converted to strings.');
  } finally {
    await client.close();
  }
}

fixApprovedBy(); 