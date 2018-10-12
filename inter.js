
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
        return (chr == '+') || (chr == '-') || 
               (chr == '*') || (chr == '/') ;
    }

    FindOpType(chr) {
        var type = "UNKNOWN"; 
        switch(chr){
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

    Tokenize(source) {
        var tokens = []; 
        var token = "";
        var state = "DEFAULT";
        
        for (var index = 0; index < source.length; index++) {
            var chr = source.charAt(index);
            switch(state){
                case "DEFAULT":
                var opType = this.FindOpType(chr);
                if (this.IsOp(chr)){
                    var tempToken =  new Token(chr, opType);
                    tokens.push(tempToken);
                }else if(this.IsParen(chr)){
                    var parenType = this.FindParenType(chr)
                    var tempToken = new Token(chr, parenType);
                    tokens.push(tempToken);
                }else if (Number.isInteger(parseInt(chr))) {
                    token += chr;
                    state = "NUMBER";
                }
                break;
            case "NUMBER":
                if (Number.isInteger(parseInt(chr))) {
                    token += chr;
                }else{
                    var tempToken = new Token(token, "NUMBER");
                    tokens.push(tempToken);
                    token = "";
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
            }else{
                console.log("Operator..: " + token.type);
                opCount++;
            }
        }); 
        console.log("You have got "+ numberCount + " different number and " + opCount+" operators.");
    
    }

}

class Calculator{
    constructor(){
        this.currentTokenPosition = 0;
        this.tokens = [];
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
        var result = 0; 
        if (this.CurrentToken().type == 'LEFT_PAREN') {
            this.MatchAndEat('LEFT_PAREN');
            result = this.ArithmeticExpression();
            this.MatchAndEat('RIGHT_PAREN');
        } else if(this.CurrentToken().type == 'NUMBER'){
            result = parseInt(this.CurrentToken().text);
            this.MatchAndEat('NUMBER');
        } 
        return result;
    }

    Term() {
        var result = this.Factor();
        while ( this.CurrentToken().type == 'MULTIPLY' ||
                this.CurrentToken().type == 'DIVIDE') {
            switch(this.CurrentToken().type) {
            case 'MULTIPLY':
                result = result * this.Multiply();
                break; 
            case 'DIVIDE':
                result = result / this.Divide();
                break; 
            }
        }   
        return result;
    }
    
    ArithmeticExpression() { 
        var result = this.Term(); 
        while (this.CurrentToken().type == 'ADD' ||
               this.CurrentToken().type == 'SUBTRACT') {
            switch(this.CurrentToken().type) { 
                case 'ADD':
                    result = result + this.Add(); 
                    break; 
                case 'SUBTRACT':
                    result = result - this.Subtract(); 
                    break; 
                }
        }
        return result; 
    }
}


function main() {
    var expression = "(600+3+2)*5";
    expression += " ";
    var calc = new Calculator();
    var tokenizer = new Tokenizer();

    console.log("Expression: " + expression);
    console.log("--------------");
    calc.tokens = tokenizer.Tokenize(expression);
    tokenizer.PrettyPrint(calc.tokens);
    console.log("--------------");
    console.log("Expression Result: " + calc.ArithmeticExpression());
    
}

main();
