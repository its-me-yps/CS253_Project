import crypto from 'crypto';
import Washerman from '../schemas/washerman.js';
import Data from '../schemas/data.js';

export const registerWasherman = async (req, res) => {
    const { contact, name, pass, halls, accountID } = req.body;

    if (!contact || !name || !halls || !pass || !accountID) {
        res.status(400).json({ message: 'Bad Request (Wrong/Missing Keys in JSON)' });
        return;
    }

    const passHash = sha256(pass);

    try {
        const existingWasherman = await Washerman.findOne({ contact });
        if (existingWasherman) {
            return res.status(400).json({ message: 'Washerman with the same contact already exists' });
        }

        const upcomingDate = new Date();
        upcomingDate.setDate(upcomingDate.getDate() + 7);

        // Create a new washman without halls
        const newWasherman = new Washerman({
            contact,
            name,
            passHash,
            upcomingDate,
            accountID
        });

        // Save the new washman to the database
        await newWasherman.save();

        // Update the washerman _id in each wing object and construct hallRefs
        const hallRefs = await Promise.all(halls.map(async hall => {
            const wingIds = await Promise.all(hall.wings.map(async wingName => {
                const wing = await Data.Wing.findOne({ parentHall: hall.name, name: wingName });
                if (!wing) {
                    throw new Error(`Wing ${wingName} does not exist in the hall ${hall.name}`);
                }
                // Update the washerman field of the wing with the new washman _id
                wing.washerman = newWasherman._id;
                await wing.save();
                return wing._id; // Return the ObjectId of the wing
            }));
            return {
                name: hall.name,
                wings: wingIds
            };
        }));

        // Update the newWasherman object with hall references
        newWasherman.halls = hallRefs;
        // Save the updated washman to the database
        await newWasherman.save();

        res.status(201).json({ message: 'Washerman registered successfully' });
    } catch (error) {
        console.error('Error registering washman:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addHallData = async (req, res) => {
    const { Halls } = req.body;

    if (!Halls) {
        res.status(500).json({ message: 'Bad Request (Wrong/Missing Keys in json)' });
        return;
    }

    try {
        for (const hallData of Halls) {
            const { hallName, wings } = hallData;

            const existingHall = await Data.Hall.findOne({ name: hallName });
            if (existingHall) {
                console.log(`Hall ${hallName} already exists`);
                continue;
            }

            // Create new wing objects
            const wingObjects = [];
            for (const wingName of wings) {
                const newWing = new Data.Wing({ parentHall: hallName, name: wingName, washerman: null });
                await newWing.save();
                wingObjects.push(newWing._id);
            }

            // Create new hall object with references to wings
            const newHall = new Data.Hall({ name: hallName, wings: wingObjects });
            await newHall.save();
            console.log(`Hall ${hallName} added successfully`);
        }
        res.status(201).json({ message: 'Halls added successfully' });
    } catch (error) {
        console.error('Error adding halls:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

const admin = { registerWasherman, addHallData };

export default admin;