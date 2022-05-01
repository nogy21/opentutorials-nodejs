// java에서 set을 남용하는 상황과 비슷
// var v1 = 'v1';
// // 100000 line code
// v1 = 'eg';
// var v2 = 'v2';

// 객체는 함수를 가질 수 있으며, 자기 자신을 참조하는 this 활용 가능
var o = {
  v1: 'v1',
  v2: 'v2',
  f1: function () {
    console.log(this.v1);
  },
  f2: function () {
    console.log(this.v2);
  },
};

o.f1();
o.f2();
