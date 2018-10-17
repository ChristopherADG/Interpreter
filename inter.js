
class Token {

    constructor(text, type){
        this.text= text;
        this.type = type;
    }

    toString(){
        return "Text: " + this.text + " Type: " + this.type;
    }
    
}

class Tokenizer{
    constructor(){
        this.expression = "";
        this.currentCharPosition = 0;
        this.Look = "";
    }

    Init(){
        this.GetChar();
    }

    GetChar(){
        if (this.currentCharPosition < this.expression.length){
            this.Look = expression.charAt(currentCharPosition);
        }
        this.currentCharPosition++;
    }

    IsOp(chr) {

        var addOp = (chr == '+') || (chr == '-');
        var mulOp = (chr == '*') || (chr == '/');
        return addOp || mulOp;
    }

    isLgicOp(chr){
        var compOp = (chr == '<') || (chr == '>') || (chr == '=');
        var lgicOp = (chr == '!') || (chr == '|') || (chr == '&');
        return compOp || lgicOp;
    }

    FindOpType(firstOperator, nextChar) {
        var type = "UNKNOWN"; 
        switch(firstOperator){
            case '+':
                type = "ADD";
                break; 
            case '-':
                type = "SUBTRACT"; 
                break;
            case '*':
                type = "MULTIPLY";
                break;
            case '/':
                type = "DIVIDE";
                break;
            case '<':
                type = "LESS";
                if(nextChar == '='){
                    type = "LESSEQUAL";
                }
                break; 
            case '>':
                type = "GREATER";
                if(nextChar == '='){
                    type = "GREATEREQUAL";
                }
                break;
            case '=':
                type = "ASSIGMENT";
                if(nextChar == '='){
                    type = "EQUAL";
                }
                break;
            case '!':
                type = "NOT";
                if(nextChar == '='){
                    type = "NOTEQUAL";
                }
                break;
            case '|':
                type = "OR";
                break;
            case '&':
                type = "AND";
                break;
        }
        return type; 
    }

    IsParen(chr){
        return (chr == '(') || (chr == ')');
    }

    FindParenType(chr){
        var type = "UNKNOWN";
        switch(chr){
            case '(':
                type = "LEFT_PAREN"; 
                break;
            case ')':
                type = "RIGHT_PAREN";
                break; 
        }
        return type;
    }

    IsVariable(chr){
        return chr.match(/[a-z]/i);
    }

    Tokenize(source) {
        var tokens = []; 

        var token = null;
        var tokenText = "";
        var firstOperator = '';
        var state = "DEFAULT";
        
        for (var index = 0; index < source.length; index++) {

            var chr = source.charAt(index);
            switch(state){

                case "DEFAULT":
                    if (this.IsOp(chr)){
                        firstOperator = chr;
                        var opType = this.FindOpType(firstOperator, '')
                        var tempToken = new Token(chr, opType);
                        tokens.push(tempToken);
                    }else if(this.isLgicOp(chr)){
                        firstOperator = chr;
                        var opType = this.FindOpType(firstOperator, '');
                        token = new Token(chr, opType);
                        state = "OPERATOR";
                    }else if (Number.isInteger(parseInt(chr))) {
                        tokenText += chr;
                        state = "NUMBER";
                    }else if(this.IsParen(chr)){
                        var parenType = this.FindParenType(chr)
                        var tempToken = new Token(chr, parenType);
                        tokens.push(tempToken);
                    }else if(this.IsVariable(chr) || chr == ";"){
                        tokenText += chr;
                        state = "VARIABLE";
                    }
                    break;
                case "OPERATOR":
                    if(this.isLgicOp(chr)){
                        var opType = this.FindOpType(firstOperator, chr);
                        token = new Token(firstOperator+chr, opType);
                        
                    }else{
                        tokens.push(token);
                        state = "DEFAULT";
                        index--;
                    }
                    break;
                case "NUMBER":
                    if (Number.isInteger(parseInt(chr))) {
                        tokenText += chr;
                    }else{
                        var tempToken = new Token(tokenText, "NUMBER");
                        tokens.push(tempToken);
                        tokenText = "";
                        state = "DEFAULT";
                        index--;
                    } 
                    break;
                case "VARIABLE":
                    if(chr.match(/[a-z]/i)){
                        tokenText += chr;
                    }else{
                        var type = this.FindStatementType(tokenText);
                        var tempToken = new Token(tokenText, type);
                        
                        tokens.push(tempToken);
                        tokenText = "";
                        state = "DEFAULT";
                        index--;
                    } 
                    break;
            }  
        }
        return tokens;
    }

    PrettyPrint(tokens) {
        var numberCount = 0; 
        var opCount = 0;
        
        tokens.forEach(token => {
            if (token.type == "NUMBER"){
                console.log("Number....: " + token.text);
                numberCount++;
            }else if(token.type == "VARIABLE"){
                console.log("Variable..: " + token.text);
            }else{
                console.log("Operator..: " + token.type);
                opCount++;
            }
        }); 
        console.log("You have got "+ numberCount + " different number and " + opCount+" operators.");
    
    }

    FindStatementType(str){
        var type = "UNKNOWN";
        switch(str)
        {
            case ";":
            type = "END";
            break;
            default:
            type = "VARIABLE";
        }
        return type;
    }
}

class Calculator{
    constructor(){
        this.currentTokenPosition = 0;
        this.tokens = [];
        this.symbolTable = [];
    }

    GetToken(offset){
        if(this.currentTokenPosition + offset >= this.tokens.length){
            return new Token("", "NO_TOKEN");
        }
        return this.tokens[this.currentTokenPosition + offset];
    }

    CurrentToken(){
        return this.GetToken(0);
    }

    EatToken(offset){
        this.currentTokenPosition += offset;
    }

    MatchAndEat(type){
        var token = this.CurrentToken();

        if(!this.CurrentToken().type == type){
            console.log("Saw " + token.type +
                            " but " + type + " expected");
        }
        this.EatToken(1);
        return token;
    }

    Add() { 
        this.MatchAndEat('ADD');
        return this.Term(); 
    }

    Subtract() { 
        this.MatchAndEat('SUBTRACT');
        return this.Term(); 
    }

    Multiply() {
        this.MatchAndEat('MULTIPLY');
        return this.Factor(); 
    }

    Divide() {
        this.MatchAndEat('DIVIDE');
        return this.Factor(); 
    }

    Factor() {
        var result = null; 

        if (this.CurrentToken().type == 'LEFT_PAREN') {

            this.MatchAndEat('LEFT_PAREN');
            result = this.BooleanExpression();
            this.MatchAndEat('RIGHT_PAREN');

        } else if(this.CurrentToken().type == 'NUMBER'){
            var token = this.MatchAndEat("NUMBER");
            result = new NumberNode(parseInt(token.text));
        } else if(this.CurrentToken().type == 'VARIABLE'){
            var token = this.MatchAndEat("VARIABLE");
            var node = new VariableNode(token.text, this);
            return node;
        }
        return result;
    }

    Term() {
        var node = this.SignedFactor();

        while ( this.CurrentToken().type == 'MULTIPLY' ||
                this.CurrentToken().type == 'DIVIDE') {

            switch(this.CurrentToken().type) {
                case 'MULTIPLY':
                    node = new BinOpNode("MULTIPLY", node, this.Multiply());
                    break; 
                case 'DIVIDE':
                    node = new BinOpNode("DIVIDE", node, this.Divide());
                    break; 
            }
        }   
        return node;
    }
    
    ArithmeticExpression() { 
        var node = this.Term(); 
        while (this.CurrentToken().type == 'ADD' ||
               this.CurrentToken().type == 'SUBTRACT') {
            switch(this.CurrentToken().type) { 
                case 'ADD':
                    node = new BinOpNode("ADD", node, this.Add());
                    break; 
                case 'SUBTRACT':
                    node = new BinOpNode("SUBTRACT", node, this.Subtract()); 
                    break; 
            }
        }
        return node; 
    }

    Relation(){
        var node = this.ArithmeticExpression();

        if(this.CurrentToken().type == "EQUAL" ||
        this.CurrentToken().type == "LESS" ||
        this.CurrentToken().type == "GREATER"||
        this.CurrentToken().type == "LESSEQUAL"||
        this.CurrentToken().type == "GREATEREQUAL"||
        this.CurrentToken().type == "NOTEQUAL"){

            switch (this.CurrentToken().type) {
                case "EQUAL":
                    this.MatchAndEat("EQUAL");
                    node = new BinOpNode("EQUAL", node, this.ArithmeticExpression());
                    break;
                case "LESS":
                    this.MatchAndEat("LESS");
                    node = new BinOpNode("LESS", node, this.ArithmeticExpression());
                    break;
                case "GREATER":
                    this.MatchAndEat("GREATER");
                    node = new BinOpNode("GREATER", node, this.ArithmeticExpression());
                    // console.log(node.left.eval());
                    // console.log(node.right.eval());
                    // console.log(node.op);
                    break;
                case "LESSEQUAL":
                    this.MatchAndEat("LESSEQUAL");
                    node = new BinOpNode("LESSEQUAL", node, this.ArithmeticExpression());
                    break;
                case "GREATEREQUAL":
                    this.MatchAndEat("GREATEREQUAL");
                    node = new BinOpNode("GREATEREQUAL", node, this.ArithmeticExpression());
                    break;
                case "NOTEQUAL":
                    this.MatchAndEat("NOTEQUAL");
                    node = new BinOpNode("NOTEQUAL", node, this.ArithmeticExpression());
                    break;
            }
        }
        return node;
    }

    BooleanTerm(){
        var node = this.NotFactor(); //BooleanFactor

        while(this.CurrentToken().type == "AND"){
            this.MatchAndEat("AND");
            node = new BinOpNode("AND", node, this.Relation());
        }
        return node;
    }

    BooleanExpression(){
        var node = this.BooleanTerm();
        //console.log(node.eval());

        while(this.CurrentToken().type == "OR" ||
                this.CurrentToken().type == "AND"){

            switch (this.CurrentToken().type) {
                case "OR":
                    this.MatchAndEat("OR");
                    node = new BinOpNode("OR", node, this.BooleanTerm());
                    break;
            }
        }

        return node;
    }

    SignedFactor(){
        if(this.CurrentToken().type == "SUBTRACT"){
            this.MatchAndEat("SUBTRACT");
            var node = new NegOpNode(this.Factor());
            return node;
        }
        return this.Factor();
    }

    NotFactor(){
        if (this.CurrentToken().type == "NOT"){
            this.MatchAndEat("NOT");
            var node = this.Relation();
            return new NotOpNode(node);
        }
        return this.Relation();
    }

    setVariable(name, value){
        var bandera = false;
        var pos = 0;
        for (var index = 0; index < this.symbolTable.length; index++) {
            if(this.symbolTable[index].name == name){
                bandera = true;
                pos = index;
            }
        }
        if(bandera){
            var vari = {name , value};
            this.symbolTable[pos] = vari;
        }else{
            var vari = {name , value};
            this.symbolTable.push(vari);
        }
        return value;
    }

    getVariable(name){
        var value;
        this.symbolTable.forEach(vari => {
            if(vari.name == name){
                
                value = vari.value;
            }
        });
        if(value != null){
            return value;
        }
        return null;
    }

    Statement(){
        var node = null;
        var type = this.CurrentToken().type;
        if (this.IsAssignment()){
            node = this.Assignment();
        }
        return node;
    }

    NextToken(){
        return this.GetToken(1);
    }

    IsAssignment(){
        var type = this.CurrentToken().type;
        return type == "VARIABLE" && this.NextToken().type == "ASSIGMENT";
    }

    Assignment(){
            var name = this.MatchAndEat("VARIABLE").text;
            this.MatchAndEat("ASSIGNMENT");
            var value = this.Relation();
            var node = new AssignmentNode(name, value, this);
            return node;
    }

    Block(){
        var statements = [];
        while (this.CurrentToken().type != "END"){
             
            statements.push(this.Statement());
        }
        this.MatchAndEat("END");
        return statements;
    }
}  

class Node{
    constructor(){}
    eval(){}
}

class VariableNode extends Node{
    constructor(varName, parser){
        super();
        this.varName = varName;
        this.parser = parser;
    }
    eval(){
        var varValue= this.parser.getVariable(this.varName);
        if(varValue == null){
            console.log("Undefined Variable: " + this.varName);
        }
        return varValue;
    }
}

class BinOpNode extends Node {
    constructor(op, left, right){
        super();
        this.op = op;
        this.left = left;
        this.right = right;
        
    }

    ToObject(node){
        return node.eval();
    }

    eval(){
        var result = null;
        switch(this.op){
            case 'ADD':
                result = (parseInt(this.left.eval()) + parseInt(this.right.eval()));
                
                break; 
            case 'SUBTRACT':
                result = (parseInt(this.left.eval()) - parseInt(this.right.eval()));
                break;
            case 'MULTIPLY':
                result = (parseInt(this.left.eval()) * parseInt(this.right.eval()));
                break;
            case 'DIVIDE':
                if (this.right.eval() == 0){
                    throw new Error("Error: Division by Zero!");
                }
                result = (parseInt(this.left.eval()) / parseInt(this.right.eval()));
                break;
            case 'LESS':
                result = (this.left.eval() < this.right.eval());
                break; 
            case 'GREATER':
                result = (this.left.eval() > this.right.eval());
                break;
            case 'EQUAL':
                result = (this.ToObject(this.left) == this.ToObject(this.right));
                break;
            case 'NOTEQUAL':
                result = (this.ToObject(this.left) != this.ToObject(this.right));
                break;
            case 'LESSEQUAL':
                result = (this.left.eval() <= this.right.eval());
                break;
            case 'GREATEREQUAL':
                result = (this.left.eval() >= this.right.eval());
                break;
            case 'OR':
                result = ((this.left == 'true') || (this.right == 'true'));
                break;
            case 'AND':
                result = ((this.left == 'true') && (this.right == 'true'));
                break;
        }
        return result;
    }

}

class NumberNode extends Node
{
    constructor(value){
        super();
        this.value = value;
        
    }

    eval(){
        return this.value;
    }
   
    toString(){
        return this.value + "";
    }
}

class BooleanNode extends Node
{
    constructor(value){
        super();
        this.value = value;
        
    }

    eval(){
        return this.value;
    }
   
    toString(){
        return this.value + "";
    }
}

class NegOpNode extends Node{
    constructor (node){
        super();
        this.node = node;
    }

    ToInt(node){
        var res = node.eval();
        return parseInt(res);
    }

    eval(){
        var result = -this.ToInt(this.node);
        return result;
    }
}

class NotOpNode extends Node
{
    constructor(node){
        super();
        this.node = node;
    }
    ToBoolean(node){
        var res = node.eval();
        return res == "true";
    }
    eval(){
        var result = this.ToBoolean(this.node);
        return result;
    }
}

class AssignmentNode extends Node{
    constructor(name, value, parser){
        super();
        this.name = name;
        this.value = value;
        this.parser = parser;
    }
    eval(){ 
        return this.parser.setVariable(this.name, this.value.eval());
    }
}

function main() {
    var calc = new Calculator();
    var tokenizer = new Tokenizer();

    var expressionList = [];
    expressionList.push("(100*2+2)*2+5>=500 ");
    expressionList.push("((5+1)*100-2+3) ");
    expressionList.push("(3==3) ");
    expressionList.push("(853+92*5)*10-20/2+771 ");
    expressionList.push("count=10");  
    
    //Interpretar
    var commandList = [];
    expressionList.forEach(expression => {
        console.log("Expression: "+ expression);
        calc.currentTokenPosition = 0;
        calc.tokens = tokenizer.Tokenize(expression);
        var node = calc.BooleanExpression();
        if (node != null){
            commandList.push(node);
        }
    });

    console.log("Now, lets calculate expressions...");
    commandList.forEach(command => {
        console.log("Expression Result: " + command.eval());
    });
    
}

function main2(){
    var calc = new Calculator();
    var tokenizer = new Tokenizer();
    var script = "cout = 5" +
    "msg = cout " +
    "cout = cout + msg; ";
    calc.tokens = tokenizer.Tokenize(script);
    //console.log(calc.tokens);
    var script = calc.Block();
    script.forEach(node => {
        node.eval();
    });
    console.log(calc.symbolTable);
}

main2();

//Pagina 130