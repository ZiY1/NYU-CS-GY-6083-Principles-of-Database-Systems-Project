import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import process from "process";

const createAdmin = async (adminName, adminPassword) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminPassword, salt);

    const newAdmin = await Admin.create({
      admin_name: adminName,
      admin_password: hashedPassword,
    });

    console.log("Admin created successfully:", newAdmin);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

const [adminName, adminPassword] = process.argv.slice(2);
if (!adminName || !adminPassword) {
  console.log("Usage: node adminRegister.js <adminName> <adminPassword>");
  process.exit(1);
}

createAdmin(adminName, adminPassword);
