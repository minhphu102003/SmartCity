import Role from "../api/v1/models/role.js";
import User from "../api/v1/models/user.js";

import {config} from "dotenv";
config();


export const createRoles = async() => {
    try{
        // count Documents
        const count = await Role.estimatedDocumentCount();

        // Check for existing roles
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
    const roles  = await Role.find({name: { $in: ["admin"] }});
    console.log(roles);

    //create a  new admin user
    const newUser = await User.create({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        roles: roles.map((role) => role._id),
    });

    console.log(`new user created: ${newUser.email}`);
}

createRoles();