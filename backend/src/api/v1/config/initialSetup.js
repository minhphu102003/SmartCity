import Role from "../models/role.js";
import User from "../models/user.js";
import Account from "../models/account.js";

import {config} from "dotenv";
config();


export const createRoles = async() => {
    try{
        const count = await Role.estimatedDocumentCount();

        if(count> 0){
            return;
        }
        const values = await Promise.all([
            new Role({name: "user"}).save(),
            new Role({name: "admin"}).save(),
        ]);
        console.log(values);
        await createAdmin();
    }
    catch(error){
        console.error(error);
    }
}


export const createAdmin  = async() => {
    const userFound = await User.findOne({email: process.env.ADMIN_EMAIL});
    console.log(userFound);
    if(userFound) return;

    // get role_id
    const roles  = await Role.find({name: { $in: ["admin","user"] }});
    console.log(roles);

    // Tạo newAccount với cú pháp new và save để đảm bảo mật khẩu được mã hóa
    const newAccount = new Account({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        roles: roles.map((role) => role._id),
    });
    await newAccount.save(); // middleware pre("save") sẽ mã hóa mật khẩu
    //create a  new admin user
    const newUser = await User.create({
        email: process.env.ADMIN_EMAIL,
        account_id: newAccount._id,
    });

    console.log(`new user created: ${newUser.email}`);
}

createRoles();