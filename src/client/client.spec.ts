import Client from "./client";


describe('Client', function() {
    let client: Client;



    describe('#getUsers()', async function() {
        it('should get users', async function(done) {
            let users = await client.getUsers()
            console.log(users)
            done()
        });
    });
});
