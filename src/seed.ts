import mongoose from 'mongoose';
import { config } from './config/config';
import Organizacion from './models/Organizacion';
import Usuario from './models/Usuario';

const seed = async () => {
    try {
        await mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' });
        console.log('Connected to DB');

        // Create 3 organizations
        const orgNames = ['Organization Alpha', 'Organization Beta', 'Organization Gamma'];
        const orgs = await Promise.all(
            orgNames.map(name => Organizacion.create({ name, usuarios: [] }))
        );
        console.log('Created 3 organizations:', orgs.map(o => o.name));

        // Create 10 users and link them randomly
        for (let i = 1; i <= 10; i++) {
            const randomOrg = orgs[Math.floor(Math.random() * orgs.length)];
            const user = await Usuario.create({
                name: `User ${i}`,
                email: `user${Date.now()}_${i}@example.com`, // using Date.now() to avoid unique email constraint issues with multiple runs
                password: `password${i}`,
                organizacion: randomOrg._id
            });
            randomOrg.usuarios.push(user._id as any);
            await randomOrg.save();
        }
        console.log('Created 10 users and linked them to matching organizations');

        await mongoose.disconnect();
        console.log('Disconnected from DB successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
