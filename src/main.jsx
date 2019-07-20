import ReactDOM from 'react-dom'
import TomatoClock from 'tomatoClock.jsx'
const nowDate = new Date();
const list = [];
const dataLen = 70;
for (let i = 0; i < dataLen; i++) {
	
		
	const typeState= i===0? 0: parseInt((i/5))%2;
	const isDone = typeState === 0;
	
	const nowType = isDone?"done":"todo";
	const newState = isDone?"end":"standby";

	const days = parseInt(i / 10);
	const saveDate = `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()-days}`;	
	const tmp = {
		content: "Test Test Test"+i,
		type: nowType,
		state: newState,
		date: saveDate
	}
	list.push(tmp);
	
}
console.log(list)
ReactDOM.render( <TomatoClock list={list} /> , document.getElementById('root'));