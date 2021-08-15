import nextConnect from "next-connect";
import getConfig from "next/config";
import * as bcrypt from "bcrypt";
import Airtable from "airtable";
import jwt from "jsonwebtoken";

var Users = new Airtable({ apiKey: "keygI9B01Rl28VLMj" }).base(
  "appMagvoR7IoNzb7Q"
)("User");

const { serverRuntimeConfig } = getConfig();

const handler = nextConnect({ attachParams: true });

const getAllUsers = async () => {
  const _data = await Users.select({ maxRecords: 1000 }).all();
  const users = _data.map(toUserObject);
  return users;
};

const getUserById = async (id) => {
  const _data = await Users.select({ maxRecords: 1000 }).all();
  const user = _data.map(toUserObject).find((x) => x.id === id);
  return user;
};

const removePassword = ({ password, ...x }) => x;

const getLoginUser = async (req) => {
  const token = req.headers?.["x-token"];
  if (!token) {
    return null;
  }
  const session = jwt.verify(token, serverRuntimeConfig.JWT_KEY);
  if (session) {
    const user = await getUserById(session.id);
    return user;
  } else {
    return null;
  }
};
const checkAdmin = async (req) => {
  const user = await getLoginUser(req);
  if (!user || user?.role !== "admin" || user?.status !== "approved") {
    throw new Error("Permission Denied");
  }
  return true;
};

const toResponse = (data) => ({
  ...data,
  timestamp: new Date().valueOf(),
});

const toUserObject = ({ id, fields }) => ({
  id,
  ...fields,
});

handler.get("/api/admin/user/list", async (req, res) => {
  try {
    const size = Number(req.query.size);
    const page = Number(req.query.page);
    await checkAdmin(req);
    const data = await Users.select({ maxRecords: 1000 }).all();
    const users = data.map(toUserObject).slice((page - 1) * size, page * size);
    res.send(toResponse({ data: users.map(removePassword) }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message,
        },
      })
    );
  }
});

handler.post("/api/app/user/register", async (req, res) => {
  try {
    const users = await getAllUsers();
    const { displayName, email, password } = req.body;
    const hasRegistered = !!users.find((user) => user.email === email);

    if (hasRegistered) {
      throw new Error("This email is registered");
    }
    const hashed = await bcrypt.hash(password, serverRuntimeConfig.SALT);

    const data = await Users.create([
      {
        fields: {
          displayName,
          email,
          password: hashed,
          status: "pending",
        },
      },
    ]);
    res.json(toResponse({ data: removePassword(toUserObject(data[0])) }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message || "Failed to register",
        },
      })
    );
  }
});

handler.post("/api/app/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const _data = await Users.select({ maxRecords: 1000 }).all();
    const users = _data.map((x) =>
      toUserObject(x, { requirePassword: true, requireStatus: true })
    );
    const hashed = await bcrypt.hash(password, serverRuntimeConfig.SALT);
    console.log(hashed);
    const user = users.find(
      (user) =>
        user.email === email &&
        user.password === hashed &&
        user.status === "approved"
    );

    if (!user) {
      throw new Error("Denied");
    }

    const token = jwt.sign(user, serverRuntimeConfig.JWT_KEY);

    res.json(toResponse({ data: { user: removePassword(user), token } }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message || "Failed to login",
        },
      })
    );
  }
});

handler.post("/api/admin/user/update", async (req, res) => {
  try {
    await checkAdmin(req);
    const { displayName, role } = req.body;
    const data = await Users.update([
      {
        id: req.body.id,
        fields: {
          displayName,
          role,
        },
      },
    ]);
    res.json(toResponse({ data: removePassword(toUserObject(data[0])) }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: "Failed to update",
        },
      })
    );
  }
});

handler.delete("/api/admin/user/delete", async (req, res) => {
  try {
    await checkAdmin(req);
    const data = await Users.destroy(req.params.id);

    if (!data.length) {
      throw new Error();
    }

    res.json(toResponse({ data: removePassword(toUserObject(data[0])) }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: "Failed to delete",
        },
      })
    );
  }
});

handler.post("/api/admin/user/approve", async (req, res) => {
  try {
    await checkAdmin(req);
    const data = await Users.update([
      {
        id: req.body.id,
        fields: {
          status: "approved",
        },
      },
    ]);
    res.json(toResponse({ data: toUserObject(data[0]) }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message || "Failed to approve",
        },
      })
    );
  }
});

handler.post("/api/admin/user/reject", async (req, res) => {
  try {
    await checkAdmin(req);

    const data = await Users.update([
      {
        id: req.body.id,
        fields: {
          status: "rejected",
        },
      },
    ]);
    res.json(toResponse({ data: removePassword(toUserObject(data[0])) }));
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message || "Failed to reject",
        },
      })
    );
  }
});

handler.get("/api/admin/user/:id", async (req, res) => {
  try {
    await checkAdmin(req);
    const data = await Users.find(req.params.id);
    res.json({
      data: removePassword(toUserObject(data)),
      timestamp: new Date().valueOf(),
    });
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message || "Failed to get user",
        },
      })
    );
  }
});

handler.get("/api/app/me", async (req, res) => {
  try {
    const user = await getLoginUser(req);
    if (!user) {
      throw new Error("Invalid !");
    }
    res.json({
      data: removePassword(user),
      timestamp: new Date().valueOf(),
    });
  } catch (error) {
    res.json(
      toResponse({
        error: {
          msgCode: 900,
          message: error.message || "Failed to get user",
        },
      })
    );
  }
});

export default handler;
