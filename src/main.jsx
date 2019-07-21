import ReactDOM from 'react-dom'
import TomatoClock from 'tomatoClock.jsx'
const nowDate = new Date();
const list = [];
const dataLen = 70;
//設定假資料，總共70筆 ，1天10筆 5筆 todo 5筆 done
for (let i = 0; i < dataLen; i++) {
	
	
	const typeState= i===0? 0: parseInt((i/5))%2;
	const isDone = typeState === 0;
	
	const nowType = isDone?"done":"todo";
	const newState = isDone?"end":"standby";

	const days = parseInt(i / 10);
	const dayMs = 24 * 60 * 60 * 1000;
	const saveMs = nowDate.getTime() - dayMs* days;
	const saveDate = new Date(saveMs);	
	const saveDateString =  `${saveDate.getFullYear()}/${saveDate.getMonth()+1}/${saveDate.getDate()}`;
	const tmp = {
		content: "Test Test Test"+i,
		type: nowType,
		state: newState,
		date: saveDateString
	}
	list.push(tmp);
	
}
console.log(list)
ReactDOM.render( <TomatoClock list={list} /> , document.getElementById('root'));