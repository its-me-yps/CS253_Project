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

        // Update the hall objects with the new washman _id
        const hallRefs = await Promise.all(halls.map(async hall => {
            const hallObject = await Data.Hall.findOne({ name: hall.name });
            if (!hallObject) {
                throw new Error(`Hall ${hall.name} does not exist`);
            }
            const wingRefs = await Promise.all(hall.wings.map(async wingName => {
                const wingObject = hallObject.wings.find(w => w.name === wingName);
                if (!wingObject) {
                    throw new Error(`Wing ${wingName} does not exist in the hall ${hall.name}`);
                }
                // Add washman id to wingObject
                wingObject.washerman = newWasherman._id;
                return wingObject.save(); // Save the wing object
            }));
            await hallObject.save();
            return { name: hall.name, wings: wingRefs };
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

    if(!Halls) {
        res.status(500).json({message: 'Bad Request (Wrong/Missing Keys in json)'});
        return;
    }

    try {
        for (const hallData of Halls) {
            const { name, wings } = hallData;

            const existingHall = await Data.Hall.findOne({ name });
            if (existingHall) {
                console.log(`Hall ${name} already exists`);
                continue;
            }  
            const newHall = new Data.Hall({
                name,
                wings: wings.map(wingName => ({ name: wingName, washerman: null }))
            });
            await newHall.save();
            console.log(`Hall ${name} added successfully`);
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