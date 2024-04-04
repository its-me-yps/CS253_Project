import Washerman from '../schemas/washerman.js';

const wingRecord = async (req, res) => {
    try {
        const { date, hall, wing } = req.body;

        const washerman = await Washerman.findOne({ contact: req.user.contact }).populate({
            path: 'halls',
            match: { name: hall },
            populate: {
                path: 'wings',
                match: { name: wing },
                populate: {
                    path: 'students',
                    populate: { path: 'records' }
                }
            }
        });

        if (!washerman) {
            return res.status(404).json({ success: false, message: 'Washerman not found' });
        }

        const hallData = washerman.halls.find(h => h.name === hall);
        if (!hallData) {
            return res.status(404).json({ success: false, message: 'Hall not found for this washerman' });
        }

        const wingData = hallData.wings.find(w => w.name === wing);
        if (!wingData) {
            return res.status(404).json({ success: false, message: 'Wing not found for this hall' });
        }

        const students = wingData.students;
        const records = students.map(student => ({
            name: student.name,
            roll: student.roll,
            record: student.records.find(record => record.date.toDateString() === new Date(date).toDateString())
        }));

        res.status(200).json({ success: true, records });
    } catch (error) {
        console.error('Error fetching wing record:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const upcomingDate = async (req, res) => {
    try {
        const { upcomingDate } = req.body;

        const washerman = await Washerman.findOne({ contact: req.user.contact });
        if (!washerman) {
            return res.status(404).json({ success: false, message: 'Washerman not found' });
        }

        washerman.upcomingDate = upcomingDate;
        await washerman.save();
        res.status(200).json({ success: true, message: 'Upcoming date updated successfully' });
    } catch (error) {
        console.error('Error updating upcoming date:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const collectCloths=async(req,res)=>{
    try {
        const { hall, wing } = req.body;

        const washerman = await Washerman.findOne({ contact: req.user.contact }).populate({
            path: 'halls',
            match: { name: hall },
            populate: {
                path: 'wings',
                match: { name: wing },
                populate: {
                    path: 'students',
                    populate: { path: 'records' }
                }
            }
        });

        if (!washerman) {
            return res.status(404).json({ success: false, message: 'Washerman not found' });
        }

        const hallData = washerman.halls.find(h => h.name === hall);
        if (!hallData) {
            return res.status(404).json({ success: false, message: 'Hall not found for this washerman' });
        }

        const wingData = hallData.wings.find(w => w.name === wing);
        if (!wingData) {
            return res.status(404).json({ success: false, message: 'Wing not found for this hall' });
        }

        const students = wingData.students;
        const records = students.map(student => ({
            name: student.name,
            roll: student.roll,
            wing: student.wing,
            hall: student.hall,
            records: student.records.filter(record => !record.accept)
        }));

        res.status(200).json({ success: true, records });
    } catch (error) {
        console.error('Error fetching wing record:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
const addEvents=async(req,res)=>{
    try {
        const { hall, wing,events } = req.body;
        console.log(events);
        const washerman = await Washerman.findOne({ contact: req.user.contact }).populate({
            path: 'halls',
            match: { name: hall },
            populate: {
                path: 'wings',
                match: { name: wing },
                populate: {
                    path: 'students',
                }
            }
        });
        if (!washerman) {
            return res.status(404).json({ success: false, message: 'Washerman not found' });
        }

        const hallData = washerman.halls.find(h => h.name === hall);
        if (!hallData) {
            return res.status(404).json({ success: false, message: 'Hall not found for this washerman' });
        }

        const wingData = hallData.wings.find(w => w.name === wing);
        if (!wingData) {
            return res.status(404).json({ success: false, message: 'Wing not found for this hall' });
        }
        if(!events){
            return res.status(404).json({ success: false, message: 'Empty events' });
        }

        const students = wingData.students;
        for (const student of students) {
            for (const event of events) {
                const existingEventIndex = student.events.findIndex(
                    e => e.date.toDateString() === new Date(event.date).toDateString()
                );
        
                if (existingEventIndex !== -1) {
                    // Merge the event types if the event date already exists
                    student.events[existingEventIndex].eventType.push(event.title);

                } else {
                    // Create a new event object if the event date doesn't exist
                    student.events.push({
                        date: new Date(event.date),
                        eventType: [event.title]
                    });
                    
                }
            }
            await student.save();
        }
        
        

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error fetching wing record:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
const washerman = {wingRecord, upcomingDate,addEvents,collectCloths};

export default washerman;