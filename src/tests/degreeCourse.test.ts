import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../server";

let mongoServer: MongoMemoryServer;
let adminToken: string;
let manfredToken: string;
let susiToken: string;
let degreeCourseID: string;
let applicationID: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await request(app).post("/api/publicUsers").send({
    userID: "admin",
    password: "123",
    isAdministrator: true,
  });

  const adminRes = await request(app)
    .get("/api/authenticate")
    .auth("admin", "123");
  adminToken = adminRes.headers["authorization"];

  await request(app)
    .post("/api/publicUsers")
    .send({ userID: "manfred", password: "asdf" });

  const manfredRes = await request(app)
    .get("/api/authenticate")
    .auth("manfred", "asdf");
  manfredToken = manfredRes.headers["authorization"];

  await request(app)
    .post("/api/publicUsers")
    .send({ userID: "susi", password: "asdf" });

  const susiRes = await request(app)
    .get("/api/authenticate")
    .auth("susi", "asdf");
  susiToken = susiRes.headers["authorization"];
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe("Authentication", () => {
  test("Login mit korrekten Credentials gibt Token zurück", async () => {
    const res = await request(app)
      .get("/api/authenticate")
      .auth("admin", "123");
    expect(res.status).toBe(200);
    expect(res.headers["authorization"]).toBeDefined();
  });

  test("Login mit falschen Credentials gibt 401 zurück", async () => {
    const res = await request(app)
      .get("/api/authenticate")
      .auth("admin", "wrongpassword");
    expect(res.status).toBe(401);
  });
});

describe("DegreeCourses", () => {
  test("Admin kann Studiengang anlegen", async () => {
    const res = await request(app)
      .post("/api/degreeCourses")
      .set("Authorization", adminToken)
      .send({
        universityName: "Beuth Hochschule",
        universityShortName: "Beuth HS",
        departmentName: "Informatik",
        departmentShortName: "FB VI",
        name: "Orchideenzucht Bachelor",
        shortName: "OZ-BA",
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    degreeCourseID = res.body.id;
  });

  test("Normaler User kann keinen Studiengang anlegen", async () => {
    const res = await request(app)
      .post("/api/degreeCourses")
      .set("Authorization", manfredToken)
      .send({
        universityName: "Beuth Hochschule",
        universityShortName: "Beuth HS",
        departmentName: "Informatik",
        departmentShortName: "FB VI",
        name: "Tulpenzucht Bachelor",
        shortName: "TZ-BA",
      });
    expect(res.status).toBe(403);
  });

  test("Studiengang abrufen", async () => {
    const res = await request(app)
      .get(`/api/degreeCourses/${degreeCourseID}`)
      .set("Authorization", adminToken);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(degreeCourseID);
  });

  test("Alle Studiengänge abrufen", async () => {
    const res = await request(app)
      .get("/api/degreeCourses")
      .set("Authorization", adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Studiengänge nach universityShortName filtern", async () => {
    const res = await request(app)
      .get("/api/degreeCourses?universityShortName=Beuth HS")
      .set("Authorization", adminToken);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].universityShortName).toBe("Beuth HS");
  });

  test("Studiengang updaten", async () => {
    const res = await request(app)
      .put(`/api/degreeCourses/${degreeCourseID}`)
      .set("Authorization", adminToken)
      .send({ name: "Tulpenzucht" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Tulpenzucht");
  });

  test("Nicht existierenden Studiengang abrufen gibt 404", async () => {
    const res = await request(app)
      .get("/api/degreeCourses/000000000000000000000000")
      .set("Authorization", adminToken);
    expect(res.status).toBe(404);
  });
});

describe("DegreeCourseApplications", () => {
  test("Manfred kann Bewerbung ohne applicantUserID anlegen", async () => {
    const res = await request(app)
      .post("/api/degreeCourseApplications")
      .set("Authorization", manfredToken)
      .send({
        degreeCourseID,
        targetPeriodYear: 2024,
        targetPeriodShortName: "WiSe",
      });
    expect(res.status).toBe(201);
    expect(res.body.applicantUserID).toBe("manfred");
    applicationID = res.body.id;
  });

  test("Admin kann Bewerbung für Susi anlegen", async () => {
    const res = await request(app)
      .post("/api/degreeCourseApplications")
      .set("Authorization", adminToken)
      .send({
        applicantUserID: "susi",
        degreeCourseID,
        targetPeriodYear: 2024,
        targetPeriodShortName: "WiSe",
      });
    expect(res.status).toBe(201);
    expect(res.body.applicantUserID).toBe("susi");
  });

  test("Doppelte Bewerbung gibt 409 zurück", async () => {
    const res = await request(app)
      .post("/api/degreeCourseApplications")
      .set("Authorization", adminToken)
      .send({
        applicantUserID: "manfred",
        degreeCourseID,
        targetPeriodYear: 2024,
        targetPeriodShortName: "WiSe",
      });
    expect(res.status).toBe(409);
  });

  test("Bewerbung für nicht existierenden Studiengang gibt Fehler", async () => {
    const res = await request(app)
      .post("/api/degreeCourseApplications")
      .set("Authorization", manfredToken)
      .send({
        degreeCourseID: "gibt es nicht",
        targetPeriodYear: 2024,
        targetPeriodShortName: "WiSe",
      });
    expect(res.status).not.toBe(201);
  });

  test("Normaler User kann keine fremde Bewerbung anlegen", async () => {
    const res = await request(app)
      .post("/api/degreeCourseApplications")
      .set("Authorization", manfredToken)
      .send({
        applicantUserID: "susi",
        degreeCourseID,
        targetPeriodYear: 2025,
        targetPeriodShortName: "SoSe",
      });
    expect(res.status).toBe(403);
  });

  test("Manfred kann seine eigenen Bewerbungen abrufen", async () => {
    const res = await request(app)
      .get("/api/degreeCourseApplications/myApplications")
      .set("Authorization", manfredToken);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].applicantUserID).toBe("manfred");
  });

  test("Admin kann Bewerbungen nach applicantUserID filtern", async () => {
    const res = await request(app)
      .get("/api/degreeCourseApplications?applicantUserID=manfred")
      .set("Authorization", adminToken);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].applicantUserID).toBe("manfred");
  });

  test("Admin kann Bewerbungen nach degreeCourseID filtern", async () => {
    const res = await request(app)
      .get(`/api/degreeCourseApplications?degreeCourseID=${degreeCourseID}`)
      .set("Authorization", adminToken);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Nested Route gibt Bewerbungen für Studiengang zurück", async () => {
    const res = await request(app)
      .get(`/api/degreeCourses/${degreeCourseID}/degreeCourseApplications`)
      .set("Authorization", adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Bewerbung updaten", async () => {
    const res = await request(app)
      .put(`/api/degreeCourseApplications/${applicationID}`)
      .set("Authorization", adminToken)
      .send({ targetPeriodYear: 2025 });
    expect(res.status).toBe(200);
    expect(res.body.targetPeriodYear).toBe(2025);
  });

  test("Bewerbung löschen", async () => {
    const res = await request(app)
      .delete(`/api/degreeCourseApplications/${applicationID}`)
      .set("Authorization", adminToken);
    expect(res.status).toBe(204);
  });
});
