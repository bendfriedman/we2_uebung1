import nodemailer from "nodemailer";
import { NotFoundError } from "../../errors/NotFoundError";
import { IContactMessage, ContactMessage } from "./ContactMessageModel";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationMail(
  senderEmail: string,
  senderName: string,
  subject: string,
): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: senderEmail,
    subject: `Bestätigung: ${subject}`,
    text: `Hallo ${senderName},\n\nvielen Dank für deine Nachricht. Wir haben sie erhalten und werden uns bald bei dir melden.\n\nMit freundlichen Grüßen\n\nBen\nUniversitätsverwaltung`,
  });
}

export async function getAllContactMessages(): Promise<IContactMessage[]> {
  return await ContactMessage.find();
}

export async function getContactMessageByID(
  id: string,
): Promise<IContactMessage> {
  const contactMessage = await ContactMessage.findById(id);
  if (!contactMessage)
    throw new NotFoundError(`ContactMessage with id ${id} not found!`);
  return contactMessage;
}

export async function createContactMessage(data: {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): Promise<IContactMessage> {
  const contactMessage = new ContactMessage(data);
  const saved = await contactMessage.save();
  try {
    await sendConfirmationMail(data.senderEmail, data.senderName, data.subject);
  } catch (emailError: unknown) {
    console.error("Bestätigungsmail konnte nicht gesendet werden:", emailError);
  }
  return saved;
}

export async function updateContactMessage(
  id: string,
  status: "new" | "read" | "answered",
): Promise<IContactMessage> {
  const contactMessage = await getContactMessageByID(id);
  contactMessage.status = status;
  return await contactMessage.save();
}

export async function deleteContactMessage(
  id: string,
): Promise<IContactMessage> {
  const contactMessage = await ContactMessage.findByIdAndDelete(id);
  if (!contactMessage)
    throw new NotFoundError(`ContactMessage with id ${id} not found!`);
  return contactMessage;
}

export async function deleteAllContactMessages(): Promise<void> {
  await ContactMessage.deleteMany({});
}
