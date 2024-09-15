import { seedRoles } from "./role.seed";
import { seedUsers } from "./user.seed";

const seedData = async () => {

    // seed alll roles
    await seedRoles();

    // seed all users
    await seedUsers();

}

export default seedData;