// Include the server in your file
const server = require('server');
const { get, post } = server.router;
const SHA256 = require('crypto-js/sha256');

//define block class
class Block {
        
    constructor(index, timestamp, data, previousHash){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    
    mineBlock(difficulty){
        let count = 0;
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            count++;
            this.hash = this.calculateHash();
        }
        
        console.log("Block successfully hashed: (" + count + " iterations). Hash: " + this.hash);
    }
    
}





class Blockchain{
    
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }
    
    createGenesisBlock(){
        return new Block(0, "15/01/2018", "Genesis Block", "0");
    }
    
    getlatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    
    addBlock(newBlock){
        newBlock.previousHash = this.getlatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    
    isChainValid(){
        var i;
        for(i = 1; i < this.chain.length; i++ ){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            //validate data integrity
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                 console.log("the current block hash is not equal to the same as calculate hash");
                console.log("The current block hash is: " + currentBlock.hash);
                console.log("The current block calculated hash is: " + currentBlock.calculateHash);
                return false;
            }
               
            //validate hash chain link
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("the current block previous hash does not match previous block hash");
                return false;
            }
        }
        //all good, no manipulated data of bad links
        return true;
    }
}

let demoChain = new Blockchain();

console.log("starting to mine a new block...");
demoChain.addBlock(new Block(1, "15/02/2018", {
    amount: 10
}));
console.log("starting to mine a new block...");
demoChain.addBlock(new Block(2, "16/02/2018", {
    amount: 25
}));

console.log(JSON.stringify(demoChain, null, 4));


console.log("Is chain valid? " + demoChain.isChainValid());
 
// Handle requests to the url "/" ( http://localhost:3000/ )
server([
  get('/', ctx => 'Hjello world!')
]);


//beginning of code from Safari
