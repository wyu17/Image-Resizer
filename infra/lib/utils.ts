import { v4 as uuidv4 } from "uuid";

export const VALID_MIMETYPES = ["image/jpeg", "image/png"];

export const generateKey = (contentType: string) => {
  const id = uuidv4();
  const fileExtension = contentType === VALID_MIMETYPES[0] ? "jpg" : "png";
  return `${id}.${fileExtension}`;
};
