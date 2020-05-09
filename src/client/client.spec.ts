import Client from "./client";


describe('Client', function() {
    let client: Client;



    describe('#getUsers()', async function() {
        it('should get users', async function(done) {
            let users = await client.getUsers()
            console.log(users)
            return true
        });
    });


    describe('#getPucks()', async function() {
        it('should get pucks', async function(done) {
            let pucks = await client.getPucks()
            console.log(pucks)
            return true
        });
    });

    describe('#getVents()', async function() {
        it('should get vents', async function(done) {
            let vents = await client.getVents()
            console.log(vents)
            return true
        });
    });
});
