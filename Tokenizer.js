var expression = ""; 
var currentCharPosition = 0;
var Look;

function Token(text, type){
    this.text = text;
    this.type = type; 
}

function Init() {
    GetChar(); 
}

function GetChar() {
    if (currentCharPosition < expression.length){
        Look = expression.charAt(currentCharPosition);
    }
    currentCharPosition++;
    
}

function IsOp(chr) {
    return (chr == '+') || (chr == '-') || (chr == '*') || (chr == '/') ||
                    (chr == '(') || (chr == ')');
}

function FindOpType(chr) {
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
        case '(':
            type = "LEFT_PAREN"; 
            break;
        case ')':
            type = "RIGHT_PAREN";
            break; 
    }
    return type; 
}

function Tokenize(source) {
    var tokens = []; 
    var token = "";
    var state = "DEFAULT";
    for (var index = 0; index < source.length; index++) {
        var chr = source.charAt(index);
        switch(state){
            case "DEFAULT":
            var opType = FindOpType(chr); 
            if (IsOp(chr)){
                var tempToken =  new Token(chr, opType);
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

function PrettyPrint(tokens) {
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
    

function main() {
    var expression = "((5+1)*100-2+3)";
    expression += " ";
    var tokens = Tokenize(expression);
    console.log("--------------");
    PrettyPrint(tokens);
    
}

main();
