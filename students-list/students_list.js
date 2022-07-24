const fs = require('fs');
const { min, max, repeat } = require('lodash');

//load data from source
dataLoader = (src) => {
    let data = fs.readFileSync(src) 
        return JSON.parse(data);
    }

//PERSON CLASS
class Person{
    name; age; gender; dob;
    constructor(name,age,gender,dob){
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.dob = dob;
    }
}

//STUDENT CLASS
class Student extends Person{
    id; classID; grades;
    constructor(name,age,gender,dob,id,classID,grades) {
        super(name,age,gender,dob);
        this.id = id;
        this.classID = classID;
        this.grades = grades;
    }
}

//GRADES CLASS
class Grades{
    maths; physics; chem; english;
    constructor(maths,physics,chem,english){
        this.maths = maths;
        this.physics = physics;
        this.chem = chem;
        this.english = english;
    }

    //calculate GPA
    avg(){ return (this.maths + this.physics + this.chem + this.english)/4; }
    
    //letter grade based on GPA
    alpha(){
        if(this.avg() < 0 || this.avg() > 10) return 'err';
        if(this.avg() < 4) return 'F';
        if(this.avg() < 5) return 'D';
        if(this.avg() < 5.5) return 'D+';
        if(this.avg() < 7) return 'C';
        if(this.avg() < 8.5) return 'B';
        return 'A';
    }

    //check if the student has passed
    passed(){
        if(this.alpha() == 'err') return console.log('grades out of range!');;
        return (this.alpha() != 'F')  ? true : false;
    }
}

//Save the json string data to destination array
initStudentsData = (data, dest) => {
        for(let i = 0 ; i< data.length; i++){
            let grades = new Grades(data[i].grades.maths,data[i].grades.physics, data[i].grades.chem,data[i].grades.english);
            dest[i] = new Student(data[i].name, data[i].age, data[i].gender, data[i].dob, data[i].id, data[i].classID, grades);
        }
}

//return a list of gpas
gpasList = (students)=>{
    let gpas = [];
    for(let student of students){
        gpas.push(student.grades.avg());
    }
    return gpas;
}

//MAIN FUNC
prtStudentsData = (students) =>{
    let highest = max(gpasList(students));
    let lowest = min(gpasList(students));
    for (let student of students) {
        let grades = student.grades;
        console.log(`\nName: ${student.name}`);
        console.log(`ID: ${student.id}`);
        console.log(`GPA: ${grades.avg()}`);
        console.log(`Rating: ${grades.alpha()}`);
        console.log(`Status: ${grades.passed() ? "Passed" : "Failed"}`);
        if(grades.avg() == lowest) console.log("Note: Lowest GPA");
        if(grades.avg() == highest) console.log("Note: Highest GPA");
        console.log();    
        console.log(repeat('-',30));
    }
}


let students = [];

//initiate student data from json file
initStudentsData(dataLoader('students_data.json'),students);

//output
prtStudentsData(students);

