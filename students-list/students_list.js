const fs = require('fs');
const { min, max, repeat } = require('lodash');
const readlineSync = require('readline-sync');
// .createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

//-----------------------FUNCTIONS AND CLASSES-----------------------//
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

//print data
prtStudentsData = (students) =>{
    console.log(repeat('*',50) + "STUDENT'S LIST"+ repeat('*',50));
    let highest = max(gpasList(students));
    let lowest = min(gpasList(students));
    for (let student of students) {
        let grades = student.grades;
        console.log(`\nName: ${student.name}`);
        console.log(`age: ${student.age} \t ID: ${student.id}`);
        console.log(`GPA: ${grades.avg()} \t Rating: ${grades.alpha()}`);
        console.log(`Status: ${grades.passed() ? "Passed" : "Failed"}`);
        if(grades.avg() == lowest) console.log("Note: Lowest GPA in the list");
        if(grades.avg() == highest) console.log("Note: Highest GPA in the list");
        console.log();    
        console.log(repeat('-',30));
    }
}

//Menu prompt, return menu index
menuPrompt = (list, type) =>{
    console.clear();
    let optionType = `${type} ` || ''
    optionType = optionType.replace('options ', '');
    let str = `Choose one ${optionType}option(Input the corresponding number, enter 0 to skip all options): \n`;
    
    //show list of options
    for(let i in list){
        str += `(${parseInt(i,10)+1}) ${list[i]}\n`; 
    }
    let index = parseInt(readlineSync.question(str)) - 1;
    console.clear();
    return index;
}

//Sort students list
sortStudents = (list, option) =>{
    
}

//Filter students list
filterStudents = (list, option) =>{

    switch (option) {
        case 'passed':
            list = list.filter(el => {return el.grades.passed()});
            break;
        case 'not passed':
            list = list.filter(el => {return !el.grades.passed()});
            break;
        case 'gpa':
            console.log('Enter gpa range:');
            let minGpa = readlineSync.question(`Minimum:`);
            let maxGpa = readlineSync.question(`Maximum:`);
            list = list.filter(el => {return (el.grades.avg() <= maxGpa && el.grades.avg() >= minGpa )});
            break;
        case 'classID': case 'gender': case'age':
            let desiredValue = readlineSync.question(`Enter ${option}:`);
            list = list.filter(el => {return el[`${option}`] == desiredValue});
            break;
        default:
            break;
    }
    return list;
}
//-----------------------MAIN PROGRAM-----------------------//
let students = [];
let optionsList = ['sort options','filter options'];
let subOptionsList = [];

//input is converted to the string of responding index of the option lists
let option = optionsList[menuPrompt(optionsList)] || ''; 
let subOption;

//initiate student data from loaded json file
initStudentsData(dataLoader('students_data.json'),students);

switch (option) {
    case 'sort options':
        subOptionsList = ['name', 'gpa', 'age'];
        subOption = subOptionsList[menuPrompt(subOptionsList, option)] || '';
        students = sortStudents(students, subOption);
        break;
    case 'filter options':
        subOptionsList = ['gpa', 'classID', 'gender', 'age','passed', 'not passed'];
        subOption = subOptionsList[menuPrompt(subOptionsList, option)] || '';
        students = filterStudents(students, subOption);
        break;
    default:
        break;
}


console.log(`You chose ${subOption}`);


//output
prtStudentsData(students);

