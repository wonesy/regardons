import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();

  const films = await db.collection("films").find({}).limit(20).toArray();

  res.json(films);
};
