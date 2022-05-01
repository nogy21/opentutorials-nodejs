var members = ['egoing', 'nogy', 'a'];
console.log(members[1]); // nogy

var i = 0;
while (i < members.length) {
  console.log('array loop', members[i]);
  i++;
}

var roles = {
  lector: 'egoing',
  programmer: 'nogy',
  grade: 'a',
};
console.log(roles.programmer); // nogy
console.log(roles['programmer']); // nogy

for (var name in roles) {
  console.log('object => ', name, 'value => ', roles[name]);
}
