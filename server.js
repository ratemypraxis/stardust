const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const MAX_RECORDINGS = 5;

app.listen(443, () => {
    console.log('p 443');
});

app.get('/getRecordingCount', (req, res) => {
    res.json({ recordingCount: getLatestRecordingCount() });
});

app.get('/saveRecording', (req, res) => {
    const fileName = req.query.fileName;
    const instancesFolderPath = 'public/instances/';
    const newFileName = `${instancesFolderPath}stardust${getNextRecordingCount()}.mp3`;
    fs.copyFileSync(`public/${fileName}`, newFileName);
    res.sendStatus(200);
});

function getLatestRecordingCount() {
    const files = fs.readdirSync('public/instances');
    return files.length;
}

function getNextRecordingCount() {
    const latestCount = getLatestRecordingCount();
    const nextCount = latestCount + 1;
    if (nextCount > MAX_RECORDINGS) {
        // Delete the oldest recording
        fs.unlinkSync(`public/instances/stardust${nextCount - MAX_RECORDINGS}.mp3`);
    }
    return nextCount;
}
