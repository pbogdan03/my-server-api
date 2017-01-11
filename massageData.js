const fs = require('fs');
const path = require('path');
const cssColors = require('css-color-names');

const _ = require('./data_helpers');
const TIMER_DATA_FILE = path.join(__dirname, 'timer-data.json');
const VOTING_DATA_FILE = path.join(__dirname, 'voting-data.json');

let colors = _.objToArr(cssColors);
colors = colors.map((color) => color.split('').splice(1).join(''));
const randomImage = (size) => {
  return `https://placehold.it/${size}/${_.randomArrayVal(colors)}`;
};

const renewVotingData = (cb) => {
  fs.readFile(VOTING_DATA_FILE, (err, data) => {
    data = JSON.parse(data);

    data = data.map(el => {
      return Object.assign({}, el, {
        votes: _.random100(),
        submitter_avatar_url: randomImage(350),
        product_image_url: randomImage(350)
      });
    });

    if (err) {
      console.log(err);
    }

    fs.writeFile(VOTING_DATA_FILE, JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);

        return false;
      }

      console.log(new Date() + ' --> VOTING_DATA_FILE overwritten...');
      if (cb) {
        cb();
      }
      return true;
    });
  });
};

renewVotingData();

module.exports = {
  renewVotingData: renewVotingData
};
