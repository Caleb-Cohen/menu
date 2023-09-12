import { Document } from 'mongoose';

export default function convertIdToString(document: Document) {
  const docObject = document.toObject() ? document.toObject() : document;
  return {
    ...docObject,
    _id: docObject._id.toString(),
  };
}
