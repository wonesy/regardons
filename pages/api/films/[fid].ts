import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { db } = await connectToDatabase();
  const { fid } = req.query;

  const singleFid = typeof fid === "string" ? fid : fid[0];

  if (!ObjectId.isValid(singleFid)) {
    res.status(404).json({ error: "invalid id" });
  }

  const films = await db
    .collection("films")
    .find({ _id: new ObjectId(singleFid) })
    .limit(1)
    .toArray();

  if (films.length >= 1) {
    res.json(films[0]);
  } else {
    res.json([]);
  }
};
