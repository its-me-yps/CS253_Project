import crypto from 'crypto';
import Washerman from '../schemas/washerman.js';
import Data from '../schemas/data.js';

const registerWasherman = async (req, res) => {
    const { id, name, pass, halls, upiID } = req.body;

    if (!id || !name || !halls || !pass || !upiID) {
        res.status(500).json({message: 'Bad Request (Wrong/Missing Keys in json)'});
        return;
    }

    const passHash = sha256(pass);

    try {
        const w = await Washerman.findOne({ id });
        if (w) {
            return res.status(400).json({ message: 'Washerman with the same ID already exists' });
        }

        const upcomingDate = new Date();
        upcomingDate.setDate(upcomingDate.getDate() + 7);

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
                return wingObject._id;
            }));
            return { name: hall.name, wings: wingRefs };
        }));

        const newWasherman = new Washerman({
            id,
            name,
            passHash,
            halls: hallRefs,
            upcomingDate,
            upiID
        });

        await newWasherman.save();

        res.status(201).json({ message: 'Washerman registered successfully' });
    } catch (error) {
        console.error('Error registering washerman:', error);
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
                wings: wings.map(wingName => ({ name: wingName }))
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