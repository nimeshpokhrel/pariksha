import { ObjectId } from "mongodb";

const convertToMongoId = (id) => {
  const mongoId = new ObjectId(id);
  return mongoId;
};

export default convertToMongoId;
