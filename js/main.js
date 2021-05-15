window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}

 //DOM
 const inpt = document.querySelector('#inpt');
 const ans = document.querySelector('#ans');
 const controls = document.querySelectorAll('.fnct');

 const btns = Array.from(document.querySelectorAll('.btn'));

 const back = document.querySelector('.back-btn');
 const ok = document.querySelector('.ok-btn');

 let currentMode;

 const BASIC_DISPLAY = [{
     name: '+',
     displayVal: '+',
     expressionVal: '+',
     supportsInv: false,
     classEl: 'plus'
 },
   {
     classEl: 'divide',
     name: '÷',
     displayVal: '÷',
     expressionVal: '/',
     supportsInv: false
 },
   {
     name: '–',
     displayVal: '–',
     expressionVal: '-',
     supportsInv: false,
     classEl: 'minus'
 },
   {
     name: '×',
     displayVal: '×',
     expressionVal: '*',
     supportsInv: false,
     classEl: 'times'
 }];
 const TRIG_DISPLAY = [{
     classEl: 'sin',
     name: 'sin',
     displayVal: 'sin(',
     expressionVal: 'Math.sin(',
     supportsInv: true,
     invExpressionVal: 'Math.asin('
 },
   {
     name: 'tan',
     displayVal: 'tan(',
     expressionVal: 'Math.tan(',
     supportsInv: true,
     invExpressionVal: 'Math.atan(',
     classEl: 'tan'
 },
   {
     name: 'rad',
     displayVal: '',
     expressionVal: '',
     supportsInv: false,
     classEl: 'rad'
 },
   {
     name: 'cos',
     displayVal: 'cos(',
     expressionVal: 'Math.cos(',
     supportsInv: true,
     invExpressionVal: 'Math.acos(',
     classEl: 'cos'
 }];
 const POWER_DISPLAY = [{
     name: 'x³',
     displayVal: '³',
     expressionVal: 'Math.pow(', //error pls check
     supportsInv: false,
     classEl: 'xpow3'

 },
   {

     name: 'x<sup>y</sup>',
     displayVal: '^',
     expressionVal: 'Math.pow(', //eror
     supportsInv: false,
     classEl: 'xpowY'

 },
   {
     name: 'x²',
     displayVal: '²',
     expressionVal: 'Math.pow(', //error
     supportsInv: false,
     classEl: 'xsqd'

 },
   {

     name: 'eˣ',
     displayVal: 'ˣ',
     expressionVal: '', //error
     supportsInv: true,
     classEl: 'epowX'

 }];
 const ROOT_DISPLAY = [{
     name: '%',
     displayVal: '%',
     expressionVal: '/100',
     supportsInv: false,
     classEl: 'percent'

 },
   {
     name: '√',
     displayVal: '√',
     expressionVal: 'Math.sqrt(',
     supportsInv: false,
     //invExpressionVal:'Math.pow('
     classEl: 'sqrt'
 },
   {
     name: '∛',
     displayVal: '∛',
     expressionVal: '', //error
     supportsInv: false,
     classEl: 'cbrt'
 },
   {
     name: '<sup>x</sup>√y',
     displayVal: '√', //error
     expressionVal: '', //error
     supportsInv: false,
     classEl: 'xThRtY'
 }];
 const MODE_DISPLAY = ['rad', 'deg', '2nd', 'm+'];
 //const CONST_DISPLAY = ['', '%', '', ''];
 const HYP_DISPLAY = ['sinh', 'tanh', 'π', 'cosh'];
 const BRACKET_DISPLAY = ['±', ')', '.', '('];
 const EXP_DISPLAY = ['ran#', '^', 'x!', 'e'];
 const MEM_DISPLAY = ['MC', 'M+', 'MR', 'M-'];
 const LOG_DISPLAY = ['log<sub>2</sub>', '10<sup>x</sup>', 'log<sub>10</sub>', 'ln'];

 const modal = document.querySelector('.modal')

 let isModalVisible = false;
 let isWaiting = false
 let hasClicked = false
 let currentBtn;
 //Globals
 let bracket = 0;
 // console.log(rtrvItem())
 let expression = rtrvItem('exp') ? rtrvItem('exp') : [];
 let display = rtrvItem('disp') ? rtrvItem('disp') : [];
 inpt.innerHTML = display.join('');
 ans.innerHTML = rtrvItem('ans');
 limit()

 if (inpt.innerHTML) updateSystemBtns('Clear', 'Delete')
 //let mode = 'basic'
 //keys();
 updateDisplay(BASIC_DISPLAY)

 function updateDisplay(mode) {
   currentMode = mode;
   controls[3].style.left = '10px'
   controls[3].style.fontSize = '26px'
   controls[2].style.fontWeight = 'normal'
   controls[1].style.right = '10px'

   //controls[1].style.right = '0px'
   controls[1].style.fontSize = '26px'
   //controls[3].style.fontSize = '17px'
   //controls[3].style.left = '0px'
   controls[0].style.fontSize = '26px'
   controls[0].style.top = '0px'
   closeTimer();
   if (mode == BASIC_DISPLAY || mode == BRACKET_DISPLAY) {
     if (mode == BRACKET_DISPLAY) {
       controls[2].style.bottom = '5px';
       controls[2].style.fontWeight = 'bolder'
     } else {
       controls[2].style.bottom = '0px';
       controls[2].style.fontWeight = 'normal'
     }
   } else {

     //modal.style.display = 'none'
     //controls[1].style.right = '10px'
     //controls[3].style.fontSize = '22px'
     //controls[3].style.left = '2px'
   }

   if (mode == ROOT_DISPLAY) {
     controls[3].style.fontSize = '19.5px'
     controls[3].style.left = '2px';
     controls[2].style.fontWeight = 'normal'
   }

   if (mode == MEM_DISPLAY || mode == POWER_DISPLAY) {
     controls[3].style.left = '7px'
     controls[1].style.right = '0px'
     controls[3].style.fontSize = '25px'
     controls[1].style.fontSize = '25px'

   }

   if (mode == POWER_DISPLAY) {
     controls[1].style.right = '5px'

   }
   if (mode == LOG_DISPLAY) {
     controls[2].style.bottom = '2.5px'
     controls[1].style.right = '0px'
     controls[1].style.fontSize = '23px'
   }

   if (mode == HYP_DISPLAY) {
     controls[1].style.right = '0px'
     controls[1].style.fontSize = '17px'
     controls[3].style.fontSize = '17px'
     controls[3].style.left = '0px'
     controls[0].style.fontSize = '22px'
     controls[0].style.top = '5px'
   }
   if (mode == TRIG_DISPLAY) {
     controls[1].style.right = '0px'
     controls[3].style.left = '0px'
     controls[1].style.fontSize = '24px'
     controls[3].style.fontSize = '23px'
   }
   if (mode == MODE_DISPLAY) {
     controls[1].style.right = '0px'
     controls[3].style.left = '0px'
     controls[1].style.fontSize = '22px'
     controls[3].style.fontSize = '23px'
   }
   if (mode == EXP_DISPLAY) {
     controls[1].style.right = '5px'
     controls[0].style.fontSize = '24px'
     controls[1].style.fontSize = '20px'
   }

   const loopLength = mode.length;
   for (let i = 0; i < loopLength; i++) {
     controls[i].innerHTML = mode[i].name;
     controls[i].className = 'fnct ' + (mode[i].classEl)
     //alert(controls[i].classList)
   }
 }

 for (let i = 0; i < btns.length; i++) {
   btns[i].addEventListener('click', () => {
     takeInput(i)
     closeTimer()


   })
 }

 /* btns.forEach((btn) => {
      btn.addEventListener('click', closeTimer)
  })*/


 let timeout;

 function closeTimer() {
   if (isWaiting) {
     isWaiting = false
     clearTimeout(timeout);
     hideModal();
   }
 }

 function initModal() {
   if (isWaiting) {

     closeTimer();
   } else {
     isWaiting = true;
     timeout = setTimeout('showModal()', 1000);
   }
 }

 function hideModal() {
   modal.style.display = 'none'
 }

 function showModal() {
   modal.style.display = 'grid'
 }

 //function takeInput(btn){
 //  console.log(btn.innerHTML)
 // }

 //function waitingChoice(btn) {
 //    console.log(btn.innerHTML)
 //  }

 //btns.forEach(btn=>{
 //    btn.addEventListener('click',takeInput)
 // })

 function takeInput(i) {

   if (isWaiting) {
     updateDisplayWithModalValue(i)
     //  console.log(isWaiting)

   } else {
     takeNumberInput(i)
     limit()
   }
 }

 function updateDisplayWithModalValue(i) {

   switch (i * 1) {
     case 0:
       updateDisplay(BASIC_DISPLAY);
       break;
     case 1:
       updateDisplay(BRACKET_DISPLAY)
       break;
     case 2:
       updateDisplay(ROOT_DISPLAY);
       break;
     case 3:
       updateDisplay(POWER_DISPLAY)
       break;
     case 4:
       updateDisplay(LOG_DISPLAY)
       break;
     case 5:
       updateDisplay(TRIG_DISPLAY)
       break;
     case 6:
       updateDisplay(MODE_DISPLAY);
       break;
     case 7:
       updateDisplay(MEM_DISPLAY)
       break;
     case 8:
       updateDisplay(EXP_DISPLAY)
       break;
     case 9:
       updateDisplay(HYP_DISPLAY)
       break;
     default:
   }

 }

 function takeNumberInput(i) {
   if (i == 9) i = -1;
   i += 1;

   if (display[display.length - 1] == 'ans') {
     display = []
     expression = []
   }
   addToDisplay(i);
   addToExpression(i);
 }

 for (let i = 0; i < controls.length - 1; i++) {
   controls[i].addEventListener('click', () => {
     //limit()

     addToDisplay(currentMode[i].displayVal)

     addToExpression(currentMode[i].expressionVal)
   })
 }

 controls[4].addEventListener('click', showResult);

 function addToDisplay(item) {
   updateSystemBtns('Clear', 'Delete')
   ans.innerHTML = ''
   display.push(item)
   inpt.innerHTML = display.join('');
   limit()
   storeItem('disp', display)
 }

 function addToExpression(item) {
   expression.push(item)
   storeItem('exp', expression)
   storeItem('ans', '')

   //let tempAns=eval(expression.join(''))
   // console.log(tempAns)
   // if(tempAns)ans.innerHTML=tempAns
 }

 function limit(str) {
   if (str) {
     if ((str + '').length < 10) {
       ans.style.fontSize = '40px'
     } else {
       ans.style.fontSize = 390 / (('' + str).length) + 'px'
     }
   } else {
     let charCount = display.join('').length;
     let currentSize = 400 / charCount;

     if (currentSize < 20) {
       inpt.style.fontWeight = '200'
       inpt.style.fontSize = '20px'

       let chars = '...' + display.join('').slice(-18)
       charCount = chars.length;
       for (let i = 0; i < 18; i++) {
         if (chars[i] == '(' || chars[i] == ')') charCount -= 0.6;
         if (chars[i] == '–') charCount += 0.2
       }
       currentSize = 400 / (charCount - 2)
       inpt.innerHTML = chars
       inpt.style.fontSize = currentSize + 'px';
       return;
     }


     inpt.style.fontSize = currentSize + 'px';
     if (charCount < 10) inpt.style.fontSize = '45px'

     /* if (display.join('').length < 10) {
        inpt.style.fontSize = '35px'
      }
      if (display.join('').length > 11) {
        inpt.style.fontSize = '20px'
      }
      if (display.join('').length > 19) {
        inpt.style.fontSize = '16px'
      }*/
   }
 }

 function updateSystemBtns(left, right) {
   ok.innerHTML = left;
   back.innerHTML = right;
   back.style.marginLeft = '193px'
   ok.style.marginLeft = '3px'
 }
 let ansNow, display2, expression2;

 function showResult() {
   let openBr = count('(', expression.join(''))
   let closeBr = count(')', expression.join(''))

   if (openBr != closeBr) {
     if (closeBr > openBr) {
       alert('error more closing')
     } else {
       for (let i = 0; i < openBr - closeBr; i++) {
         addToDisplay(')');
         addToExpression(')')
       }
     }

   }

   ansNow = eval(expression.join(''))
   if (ansNow) {
     display2 = display;
     expression2 = display;

     display = ['ans']
     expression = [ansNow]
   }
   let ansString;
   if (ansNow < 10) {
     ansString = ansNow.toFixed(9) * 1;
   } else {
     ansString = ansNow.toFixed(5) * 1
   }

   if (true) {
     limit(ansString)
   }
   ans.innerHTML = ansString
   storeItem('ans', ansString)
 }

 function count(ch, str) {
   //var str = "A,B,C,D,E"; 
   //var ch = ',';
   let count = str.split(ch).length - 1;
   return (count);
 }

 /*const x=[1,2,3]
 storeItem('inpt',x)
 let y=rtrvItem('inpt')
 console.log(y)*/

 function storeItem(key, val) {
   localStorage.setItem(key, JSON.stringify(val));
 }

 function rtrvItem(key) {
   const val = localStorage.getItem(key);
   return JSON.parse(val)
 }

 ok.addEventListener("click", () => {
   display = []
   expression = []
   ans.innerHTML = '0'
   inpt.innerHTML = ''
   storeItem('disp', [])
   storeItem('ans', 0)
   storeItem('exp', [])
 })

 back.addEventListener("click", () => {
   if (true) {
     expression = rtrvItem('exp') ? rtrvItem('exp') : [];
     display = rtrvItem('disp') ? rtrvItem('disp') : [];

   }
   display.pop()
   expression.pop()
   storeItem('exp', expression)
   storeItem('disp', display)
   let storeAnsAs = display.length > 0 ? '' : 0;
   storeItem('ans', storeAnsAs)
   ans.innerHTML = display.length > 0 ? '' : 0
   inpt.innerHTML = display.join('')
   limit()
 })
