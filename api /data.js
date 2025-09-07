const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const router = express.Router();
const GITHUB_TOKEN = process.env.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; // Ваш токен доступа
const REPO_OWNER = 'aleksandrkoshelev2000-cpu'; // Ваше имя пользователя
const REPO_NAME = 'monitoring.gitHub.io'; // Имя вашего репозитория
const FILE_PATH = 'data.json'; // Путь к файлу в репозитории
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

// Middleware
router.use(bodyParser.json());

// Получение данных из GitHub
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });
        const content = Buffer.from(response.data.content, 'base64').toString();
        res.json(JSON.parse(content));
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Ошибка получения данных.');
    }
});

// Сохранение данных в GitHub
router.post('/', async (req, res) => {
    try {
        const jsonData = JSON.stringify(req.body);
        const base64Data = Buffer.from(jsonData).toString('base64');

        const { data } = await axios.get(API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        await axios.put(API_URL, {
            message: 'Update student data',
            content: base64Data,
            sha: data.sha, // SHA файла для обновления
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        res.send('Данные успешно сохранены.');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send('Ошибка сохранения данных.');
    }
});

module.exports = router;
