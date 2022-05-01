var M = {
  v: 'v',
  f: function () {
    console.log(this.v);
  },
};

// 외부에서 사용 가능
module.exports = M;
