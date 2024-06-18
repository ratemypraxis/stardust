const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const MAX_RECORDINGS = 5;

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Get the latest recording count
app.get('/getRecordingCount', (req, res) => {
    res.json({ recordingCount: getLatestRecordingCount() });
});

// Save the recording and update the recording count
app.get('/saveRecording', (req, res) => {
    const fileName = req.query.fileName;
    const instancesFolderPath = 'public/instances/';
    const newFileName = `${instancesFolderPath}stardust${getNextRecordingCount()}.mp3`;
    fs.copyFileSync(`public/${fileName}`, newFileName);
    res.sendStatus(200);
});

// Get the latest recording count
function getLatestRecordingCount() {
    const files = fs.readdirSync('public/instances');
    return files.length;
}

// Get the next recording count
function getNextRecordingCount() {
    const latestCount = getLatestRecordingCount();
    const nextCount = latestCount + 1;
    if (nextCount > MAX_RECORDINGS) {
        // Delete the oldest recording
        fs.unlinkSync(`public/instances/stardust${nextCount - MAX_RECORDINGS}.mp3`);
    }
    return nextCount;
}
