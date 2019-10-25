import React from 'react';
import BulletinManager from '../BulletinManager';
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
}

describe('BulletinManager', () => {
  it('loads dates from same month', async () => {
    m = new BulletinManager("daily-bulletin");
    m.s3 = new MockS3Manager();
    s = new MockScreen();
    m.getAvailableDates(new Date(2019, 9), s);
    expect(s.state).toStrictEqual({loadingDates: false, validDates: [new Date(2019, 9, 20)]});
  });
});
