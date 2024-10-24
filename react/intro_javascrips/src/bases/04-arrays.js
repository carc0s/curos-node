const array=[1,2,3,4,5,6,7,8,9,10];


let array2=[...array,5]
let array3=array2.map(function(numero){

    return numero*2
});
console.log(array3)