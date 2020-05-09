import Client from "./client";

describe('Client', function() {
    let client: Client;


    beforeEach(() => {
        client = new Client(process.env.clientID!, process.env.clientSecret!, process.env.username!, process.env.password!);
    })


    // describe('#getUsers()', async function() {
    //     it('should get users', async function(done) {
    //         let users = await client.getUsers()
    //         return true
    //     });
    // });
    //
    //
    // describe('#getPucks()', async function() {
    //     it('should get pucks', async function(done) {
    //         let pucks = await client.getPucks()
    //         return true
    //     });
    // });
    //
    // describe('#getVents()', async function() {
    //     it('should get vents', async function(done) {
    //         let vents = await client.getVents()
    //         return true
    //     });
    // });
    //
    // describe('#getVentReading()', async function() {
    //     it('should get vents', async function(done) {
    //         let vents = await client.getVents()
    //         let vent = await client.getVentReading(vents[0])
    //         return true
    //     });
    // });


    // describe('#getPuckReading()', async function() {
    //     it('should get pucks', async function(done) {
    //         let pucks = await client.getPucks()
    //         let puck = await client.getPuckReading(pucks[0])
    //         console.log(puck);
    //         return true
    //     });
    // });

    // describe('#setVentPercentOpen()', async function() {
    //     it('should set vent percent', async function(done) {
    //         let vents = await client.getVents()
    //         let vent = await client.setVentPercentOpen(vents[0], 0)
    //         return true
    //     });
    // });
});
