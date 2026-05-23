import { IContactMessage } from "./ContactMessageModel";

export interface ContactMessageResponse {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: Date;
  status: "new" | "read" | "answered";
}

export function mapContactMessage(
  contactMessage: IContactMessage,
): ContactMessageResponse {
  return {
    id: contactMessage._id.toString(),
    senderName: contactMessage.senderName,
    senderEmail: contactMessage.senderEmail,
    subject: contactMessage.subject,
    message: contactMessage.message,
    createdAt: contactMessage.createdAt,
    status: contactMessage.status,
  };
}
