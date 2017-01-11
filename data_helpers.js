module.exports = {
  random100: () => {
    return Math.round(Math.random() * 100);
  },

  randomArrayVal: (a) => {
    let rand = Math.round(Math.random() * a.length);

    return a[rand];
  },

  objToArr: (o) => {
    let arr = [];
    for (let k of Object.keys(o)) {
      arr.push(o[k]);
    }
    return arr;
  }
};
