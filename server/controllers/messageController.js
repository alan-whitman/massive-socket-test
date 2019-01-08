module.exports = {
    async getMessages(req, res) {
        const db = req.app.get('db');
        const messages = await db.get_messages();
        res.send(messages);
    }
}