
var expression = ""; 
var currentCharPosition = 0; 
//var currentTokenPosition = 0;
var Look;

function Init() {
    GetChar(); 
}

function GetChar() {
    if (currentCharPosition < expression.length){
        Look = expression.charAt(currentCharPosition);
    }
    currentCharPosition++;
    
}

function GetNum() {
    var number = 0;
    var tempStr = "";
    if (!Number.isInteger(parseInt(Look))) {
        console.log("Error: Numbers expected."); 
    }
    while (Number.isInteger(parseInt(Look))) {
        tempStr = tempStr + Look;
        GetChar();
    }
    number = parseInt(tempStr);
    return number;
}

function MatchAndEat(chr) { 
    if (Look==chr){
        GetChar(); 
    }else { 
        console.log("Error: Unexpected character.");
    }
} 

//Parse functions

function Term() {
    var result = Factor();
    while ( (Look == '*') || (Look == '/') ) {
        switch(Look) {
        case '*':
            result = result * Multiply();
            break; 
        case '/':
            result = result / Divide();
            break; 
        }
    }   
    return result;
}     

function Factor() {
    var result = 0; 
    if (Look == '(') {
        MatchAndEat('(');
        result = ArithmeticExpression();
        MatchAndEat(')');
    } else result = GetNum();
    return result;
}

//Operadores aritmeticos

function Add() { 
    MatchAndEat('+');
    return Term(); 
} 
function Subtract() { 
    MatchAndEat('-');
    return Term(); 
}
function Multiply() {
    MatchAndEat('*');
    return Factor(); 
}
function Divide() {
    MatchAndEat('/');
    return Factor(); 
}
    
function ArithmeticExpression() { 
    var result = Term(); 
    while ((Look == '+') || (Look == '-')) {
        switch(Look) { 
            case '+':
                result = result + Add(); 
                break; 
            case '-':
                result = result - Subtract(); 
                break; 
            }
    }
    return result; 
}  



function main(){
    expression = "((5+1)*100-2+3)"; 
    expression += " "; 
    console.log("Expression: " + expression); 
    Init();
    var result = ArithmeticExpression(); 
    console.log("Calculation Result: " + result);
}

main();