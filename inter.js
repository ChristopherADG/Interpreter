
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
        var powOp = (chr == '^') || (chr == '%');
        return addOp || mulOp || powOp;
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
            case '^':
                type = "POW";
                break;
            case '%':
                type = "MODULUS";
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
                    if(this.IsVariable(chr)){
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
            case "while":
                type = "WHILE";
                break;
            case "if":
                type = "IF";
                break;
            case "else":
                type = "ELSE";
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
        this.symbolTable = [{name: "pi", value: 3.141592653589793}];
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

    Factor() {
        var result = null; 

        if (this.CurrentToken().type == 'LEFT_PAREN') {

            this.MatchAndEat('LEFT_PAREN');
            result = this.BooleanExpression();
            this.MatchAndEat('RIGHT_PAREN');

        } else if(this.CurrentToken().type == 'NUMBER'){
            var token = this.MatchAndEat("NUMBER");
            result = new NumberNode(parseFloat(token.text));
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
                this.CurrentToken().type == 'DIVIDE' ||
                this.CurrentToken().type == 'POW'|| 
                this.CurrentToken().type == 'MODULUS') {

            switch(this.CurrentToken().type) {
                case 'MULTIPLY':
                    this.MatchAndEat('MULTIPLY');
                    node = new BinOpNode("MULTIPLY", node, this.Term());
                    break; 
                case 'DIVIDE':
                    this.MatchAndEat('DIVIDE');
                    node = new BinOpNode("DIVIDE", node, this.Term());
                    break;
                case 'POW':
                    this.MatchAndEat('POW');
                    node = new BinOpNode("POW", node, this.Factor());
                    break;
                case 'MODULUS':
                    this.MatchAndEat('MODULUS');
                    node =new BinOpNode("MODULUS", node, this.Term());
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
                    this.MatchAndEat('ADD');
                    node = new BinOpNode("ADD", node, this.Term());
                    break; 
                case 'SUBTRACT':
                    this.MatchAndEat('SUBTRACT');
                    node = new BinOpNode("SUBTRACT", node, this.Term()); 
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
    //VERY IMPORTANT METHOD
    Statement(){
        var node = null;
        var type = this.CurrentToken().type;
        if (this.IsAssignment()){
            node = this.Assignment();
        }else if (this.IsWhile())
        {
            node = this.While();
        }else if (this.IsIfElse()){
            node = this.If();
        }
        else{
            node = this.BooleanExpression();
        }
        return node;
    }


    IsWhile(){
        return this.CurrentToken().type == "WHILE"
    }

    While(){
        var condition, body;
        this.MatchAndEat("WHILE");
        condition = this.Relation();
        body = this.Block();
        return new WhileNode(condition, body);
    }

    IsAssignment(){
        var type = this.CurrentToken().type;
        return type == "VARIABLE" && this.GetToken(1).type == "ASSIGMENT";
    }

    Assignment(){
            var name = this.MatchAndEat("VARIABLE").text;
            this.MatchAndEat("ASSIGNMENT");
            var value = this.Relation();
            var node = new AssignmentNode(name, value, this);
            return node;
    }

    IsIfElse(){
        var type = this.CurrentToken().type;
        return type == "IF" || type == "ELSE";
    }

    If(){
        var condition=null, thenPart=null, elsePart=null;
        this.MatchAndEat("IF");
        condition = this.Relation();
        thenPart = this.Block();
        if ( this.CurrentToken().type == "ELSE" ){
             this.MatchAndEat("ELSE");
            if (this.CurrentToken().type == "IF" ){
                elsePart = this.If();
            }else{
                elsePart = this.Block();
            } 
        }
        return new IfNode(condition, thenPart, elsePart);
    }

    Block(){
        var statements = [];
        while (this.CurrentToken().type != "END"){
             
            statements.push(this.Statement());
        }
        this.MatchAndEat("END");
        return new BlockNode(statements);
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
                result = (this.left.eval() +this.right.eval());
                
                break; 
            case 'SUBTRACT':
                result = (this.left.eval() - this.right.eval());
                break;
            case 'MULTIPLY':
                result = (this.left.eval() * this.right.eval());
                break;
            case 'DIVIDE':
                if (this.right.eval() == 0){
                    throw new Error("Error: Division by Zero!");
                }
                result = (this.left.eval() / this.right.eval());
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
            case 'POW':
                result = (Math.pow(this.left.eval(), this.right.eval()));
                break;
            case 'MODULUS':
                result = (this.left.eval() % this.right.eval());
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

class BlockNode extends Node{
    constructor(statements){
        super();
        this.statements = statements;
    }
    eval(){
        var ret = null;
        this.statements.forEach(statement => {
            ret = statement.eval();
        });
        
        return ret;
    }

    get(index){
        return this.statements[index];
    }

    getStatements(){
        return this.statements;
    }

    toString(){
        var str = "";
        this.statements.forEach(statement => {
            str = str + statement + "\n";
        });
        return str;
    }
}

class WhileNode extends Node
{
    constructor(condition, body){
        super();
        this.condition = condition;
        this.body = body;
    }
    eval(){
    var ret = null;
    while (this.condition.eval())
    {
        ret = this.body.eval();
    }
    return ret;
    }
}

class IfNode extends Node{
    constructor( condition, thenPart, elsePart){
        super();
        this.condition = condition;
        this.thenPart = thenPart;
        this.elsePart = elsePart;
    }

    eval(){
        var ret = null;
        if ( (this.condition != null) && (this.thenPart != null)){
            if(this.condition.eval()){
                ret = this.thenPart.eval();
            }
        }else if((this.condition != null) && (this.elsePart != null)){
            if(!this.condition.eval()){
                ret = this.thenPart.eval();
            }
        }
        return ret;
    }
}

function main(){
    fs = require('fs');
    fs.readFile('/Users/christopher/Desktop/Inter/script.txt', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var calc = new Calculator();
        var tokenizer = new Tokenizer();
        var script = data.toString();
        calc.tokens = tokenizer.Tokenize(script);
        //console.log(calc.tokens);
        var script = calc.Block();
        script.eval();
        console.log(calc.symbolTable);
    });
}

main();

//Pagina 196