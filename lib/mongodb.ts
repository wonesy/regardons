import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const g: any = global;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!g._mongoClientPromise) {
    client = new MongoClient(uri!, options);
    g._mongoClientPromise = client.connect();
  }
  clientPromise = g._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  // check the cached.
  if (client && (await clientPromise)) {
    // load from cache
    return {
      client: client,
      db: client.db(process.env.MONGODB_DB),
    };
  }

  // Connect to cluster
  client = new MongoClient(process.env.MONGODB_URI!);
  clientPromise = client.connect();
  await clientPromise;

  return {
    client: client,
    db: client.db(process.env.MONGODB_DB),
  };
}

export default clientPromise;
