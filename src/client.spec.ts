import { Client } from './client';

import { setupRecorder } from "nock-record";
import { expect } from 'chai';

const record = setupRecorder();

describe('Client', () => {
  let client: Client;

  let scopeCompleteRecording, scopeAssertScopesFinished;
  let counter = 0;
  
  beforeEach( async () => {
    //Jest has no way to get a test name... so we have to use a simple counter.
    //https://github.com/facebook/jest/issues/7774
    const { completeRecording, assertScopesFinished } = await record(`flair-${counter}`);
    scopeAssertScopesFinished = assertScopesFinished;
    scopeCompleteRecording = completeRecording;
    client = new Client('test_client_id', 'test_client_secret', 'test_username', 'test_password');
  });

  afterEach(async () => {
    scopeCompleteRecording();
    scopeAssertScopesFinished();
    counter++;
  })


  describe('0 #getUsers()',() => {
    it('should get users', async () => {
      const result = await client.getUsers();
      expect(result[0].email).to.eql('test_email')
    });
  });


  describe('1 #getPucks()', () => {
    it('should get pucks', async () => {
      const result = await client.getPucks();
      expect(result.length).to.eql(6)
    });
  });

  describe('2 #getVents()', () => {
    it('should get vents', async () => {
      const result = await client.getVents();
      expect(result.length).to.eql(9)
    });
  });

  describe('3 #getVentReading()', () => {
    it('should get vents', async () => {
      const vents = await client.getVents();
      const result = await client.getVentReading(vents[0]);
      expect(result.ductTemperatureC).to.eql(23.51)
    });
  });


  describe('4 #getPuckReading()', () => {
    it('should get pucks', async () => {
      const pucks = await client.getPucks();
      const result = await client.getPuckReading(pucks[0]);
      expect(result.currentHumidity).to.eql(34)
    });
  });

  describe('5 #setVentPercentOpen()', () => {
    it('should set vent percent', async () => {
      const vents = await client.getVents();
      const result = await client.setVentPercentOpen(vents[0], 0);
      expect(result.percentOpen).to.eql(0)
    });
  });

  describe('6 #getRooms()', () => {
    it('should get rooms', async () => {
      const result = await client.getRooms();
      expect(result.length).to.eql(7)
    });
  });

  describe('7 #setRoomSetPoint()', () => {
    it('should set room setpoint', async () => {
      const rooms = await client.getRooms();
      const result = await client.setRoomSetPoint(rooms[0], 24);
      expect(result.setPointC).to.eql(24)
    });
  });
});
