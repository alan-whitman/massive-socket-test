module.exports = {
    async relayMsg(io, client, db, message) {
        try {
            console.log(message);
            const { text, username } = message;
            client.to('default-room').emit('relay message', message);
            await db.create_message({text, username});
        } catch(err) {
            console.log(err);
        }
    }
}