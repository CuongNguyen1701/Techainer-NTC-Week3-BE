const fs = require('fs');
const { min, max, repeat } = require('lodash');

class Person{
    name; age; gender; dob;
    constructor(name,age,gender,dob){
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.dob = dob;
    }
}
class Student extends Person{
    id; classID; grade;
    constructor(name,age,gender,dob,id,classID,grade) {
        super(name,age,gender,dob);
        this.id = id;
        this.classID =classID;
        this.grade = grade;
    }
}
class Grade{
    maths; physics; chem; english;
    constructor(maths,physics,chem,english){
        this.maths = maths;
        this.physics = physics;
        this.chem = chem;
        this.english = english;
    }
    avg(){ return (this.maths + this.physics + this.chem + this.english)/4; }
    alpha(){
        if(this.avg() < 0 || this.avg() > 10) return 'err';
        if(this.avg() < 4) return 'F';
        if(this.avg() < 5) return 'D';
        if(this.avg() < 5.5) return 'D+';
        if(this.avg() < 7) return 'C';
        if(this.avg() < 8.5) return 'B';
        return 'A';
    }
    passed(){
        if(this.alpha() == 'err') return console.log('Grade out of range!');;
        return (this.alpha() != 'F')  ? true : false;
    }
}

dataLoader = (src,dest) => {
    let data = fs.readFileSync(src) 
        data = JSON.parse(data);
        for(let i = 0; i < data.length; i++){
            let grade = new Grade(data[i].grade.maths,data[i].grade.physics, data[i].grade.chem,data[i].grade.english);
            dest[i] = new Student(data[i].name, data[i].age, data[i].gender, data[i].dob, data[i].id, data[i].classID, grade);
        }

}

let dataArray = [];
let lowest = 10;
let highest = 0;
dataLoader('students_data.json',dataArray);

// for (let i = 0; i < students_data.length; i++) {
//     dataArray[i] = new Data(students_data[i]); 
//     let avg = dataArray[i].avg();
//     lowest = (avg < lowest) ? avg : lowest;
//     highest = (avg > highest) ? avg : highest;
// }

for (let i = 0; i < dataArray.length; i++) {
    console.log(`\nName: ${dataArray[i].name}`);
    console.log(`ID: ${dataArray[i].id}`);
    console.log(`GPA: ${dataArray[i].grade.avg()}`);
    console.log(`Rating: ${dataArray[i].grade.alpha()}`);
    console.log(`Status: ${dataArray[i].grade.passed() ? "Passed" : "Failed"}`);
    if(dataArray[i].grade.avg() == lowest) console.log("Note: Lowest GPA");
    if(dataArray[i].grade.avg() == highest) console.log("Note: Highest GPA");
    console.log();    
    console.log(repeat('-',30));
}
