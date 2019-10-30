import React from 'react';
import SportsManager from '../SportsManager';
import renderer from 'react-test-renderer';

function MockScreen() {
  this.state = {}
  this.setState = function(value) {
    this.state = Object.assign(this.state, value);
  }
}

function MockS3Manager() {
  this.list = (month, callback) => {
    callback([new Date(2019, 9, 20)]);
  }
  this.get = (key, extra, callback) => {
    callback({"events": []}, extra);
  }
}

describe('SportsManager', () => {
  it('loads dates from same month', async () => {
    m = new SportsManager("daily-bulletin");
    m.s3 = new MockS3Manager();
    s = new MockScreen();
    m.getAvailableDates(new Date(2019, 9), s);
    expect(s.state).toStrictEqual({loadingSports: false, validDates: [new Date(2019, 9, 20)]});
  });
  it('loads data from one day', async () => {
    m = new SportsManager("daily-bulletin");
    m.s3 = new MockS3Manager();
    s = new MockScreen();
    m.getData(new Date(2019, 9, 20), 1, s);
    console.log(s.state);
    sportsData = {}
    sportsData[new Date(2019, 9, 20).getTime()] = {"events": []};
    expect(s.state).toStrictEqual({loadingSports: false, sportsData: sportsData});
  });
});
