import { Client } from './client';

describe('Client', () => {
  let client: Client;


  beforeEach(() => {
    client = new Client(process.env.clientID!, process.env.clientSecret!, process.env.username!, process.env.password!);
  });


  describe('#getUsers()', async () => {
    it('should get users', async () => {
      await client.getUsers();
      return true;
    });
  });


  describe('#getPucks()', async () => {
    it('should get pucks', async () => {
      await client.getPucks();
      return true;
    });
  });

  describe('#getVents()', async () => {
    it('should get vents', async () => {
      await client.getVents();
      return true;
    });
  });

  describe('#getVentReading()', async () => {
    it('should get vents', async () => {
      const vents = await client.getVents();
      await client.getVentReading(vents[0]);
      return true;
    });
  });


  describe('#getPuckReading()', async () => {
    it('should get pucks', async () => {
      const pucks = await client.getPucks();
      await client.getPuckReading(pucks[0]);
      return true;
    });
  });

  describe('#setVentPercentOpen()', async () => {
    it('should set vent percent', async () => {
      const vents = await client.getVents();
      await client.setVentPercentOpen(vents[0], 0);
      return true;
    });
  });

  describe('#getRooms()', async () => {
    it('should get rooms', async () => {
      await client.getRooms();
      return true;
    });
  });

  describe('#setRoomSetPoint()', async () => {
    it('should set room setpoint', async () => {
      const rooms = await client.getRooms();
      await client.setRoomSetPoint(rooms[0], 24);
      return true;
    });
  });
});
