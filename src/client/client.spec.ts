import Client from "./client";


describe('Client', function() {
    let client: Client;




    describe('#me()', async function() {
        it('should get a me', async function(done) {
            let users = await client.getUsers()
            console.log(users)

        });
    });
});
