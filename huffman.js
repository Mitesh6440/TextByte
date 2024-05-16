class HuffmanCoder {
    constructor(feeder) {
        this.encoder = new Map();
        this.decoder = new Map();
        const fmap = new Map();
  
        for (let i = 0; i < feeder.length; i++) {
            const cc = feeder.charAt(i);
            if (fmap.has(cc)) {
                let ov = fmap.get(cc);
                ov += 1;
                fmap.set(cc, ov);
            } else {
                fmap.set(cc, 1);
            }
        }
  
        const minHeap = new Heap();
  
        for (const [key, value] of fmap.entries()) {
            const node = new Node(key, value);
            minHeap.insert(node);
        }
  
        while (minHeap.size() !== 1) {
            const first = minHeap.remove();
            const second = minHeap.remove();
  
            const newNode = new Node('\0', first.cost + second.cost);
            newNode.left = first;
            newNode.right = second;
  
            minHeap.insert(newNode);
        }
  
        const ft = minHeap.remove();
  
        this.initEncoderDecoder(ft, "");
    }
  
    initEncoderDecoder(node, osf) {
        if (node === null) {
            return;
        }
        if (node.left === null && node.right === null) {
            this.encoder.set(node.data, osf);
            this.decoder.set(osf, node.data);
        }
        this.initEncoderDecoder(node.left, osf + "0");
        this.initEncoderDecoder(node.right, osf + "1");
    }
  
    encode(source) {
        let ans = "";
  
        for (let i = 0; i < source.length; i++) {
            ans += this.encoder.get(source.charAt(i));
        }
  
        return ans;
    }
  
    decode(codedString) {
        let key = "";
        let ans = "";
        for (let i = 0; i < codedString.length; i++) {
            key += codedString.charAt(i);
            if (this.decoder.has(key)) {
                ans += this.decoder.get(key);
                key = "";
            }
        }
        return ans;
    }
}

class Node {
    constructor(data, cost) {
        this.data = data;
        this.cost = cost;
        this.left = null;
        this.right = null;
    }
}

class Heap {
    constructor() {
        this.heap = [];
    }

    size() {
        return this.heap.length;
    }

    insert(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    remove() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return min;
    }

    bubbleUp(index) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];
        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const parent = this.heap[parentIndex];
            if (currentElement.cost >= parent.cost) break;
            this.heap[currentIndex] = parent;
            currentIndex = parentIndex;
        }
        this.heap[currentIndex] = currentElement;
    }

    bubbleDown(index) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];
        const length = this.heap.length;
        while (true) {
            const leftChildIndex = 2 * currentIndex + 1;
            const rightChildIndex = 2 * currentIndex + 2;
            let leftChild, rightChild;
            let swap = null;
            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild.cost < currentElement.cost) {
                    swap = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.cost < currentElement.cost) ||
                    (swap !== null && rightChild.cost < leftChild.cost)
                ) {
                    swap = rightChildIndex;
                }
            }
            if (swap === null) break;
            this.heap[currentIndex] = this.heap[swap];
            this.heap[swap] = currentElement;
            currentIndex = swap;
        }
    }
}

let hashmap = {}; // key <-- encoded string   ,   value <-- original string


document.getElementById('Encode').addEventListener('click',(e)=>{
    const text = document.querySelector('.t11').value;
    if(text === ""){
        alert("Enter Valid text")
    }
    const huffman = new HuffmanCoder(text);
    const encodedText = huffman.encode(text);
    document.querySelector('.t12').value = encodedText;
    let org = text.length*16
    let compress = encodedText.length
    document.getElementById('org1').innerText = org + " bits"
    document.getElementById('comp1').innerText = compress + " bits"

    // adding encoded text to prev
    let ol = document.getElementById('prev');
    let li = document.createElement('li')
    li.appendChild(document.createTextNode(encodedText))
    ol.appendChild(li)

    // adding key,value to hashmap
    let key = encodedText;
    let value = text;
    hashmap[key] = value;
})



document.getElementById('clear1').addEventListener('click',(e)=>{
    document.querySelector('.t11').value = "";
    document.querySelector('.t12').value = "";
    document.getElementById('org1').innerText = "";
    document.getElementById('comp1').innerText = "";
})

document.getElementById('clear2').addEventListener('click',(e)=>{
    document.querySelector('#prev').innerHTML = "";
})

document.getElementById('decode').addEventListener('click',(e)=>{
    let encodedtext = document.getElementById('t21').value;
    let original;
    let comp;
    let org;
    if(hashmap.hasOwnProperty(encodedtext)){
        original = hashmap[encodedtext]
        document.querySelector('#t22').value = original;
        comp = encodedtext.length;
        org = original.length*16;
        document.getElementById('comp2').innerText = comp + " bits"
        document.getElementById('org2').innerText = org + " bits"
    }else{
        alert("Invalid Encoded Text")
    }
})

document.getElementById('clear3').addEventListener('click',()=>{
    document.querySelector('#t21').value = "";
    document.querySelector('#t22').value = "";
    document.getElementById('comp2').innerText = ""
    document.getElementById('org2').innerText = ""
})


document.getElementById('prev').addEventListener('click',(e)=>{
    console.log(e.target);
    if(e.target.tagName == 'LI'){
        document.getElementById('t21').value = e.target.innerText;
    }
})