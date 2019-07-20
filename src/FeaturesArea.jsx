import {Bar} from "react-chartjs-2"
//功能設定區
export default class FeaturesArea extends React.Component{
	constructor(props){
		super(props);	
		this.state ={
			nowActivePage:"home"
		}
		this.getActivePage = this.getActivePage.bind(this);
		this.setPageChange =this.setPageChange.bind(this);
	}

	setPageChange(menu){
		this.setState({
			nowActivePage:menu
		});
	}

	getActivePage(pageName){
		let ret = "";
		switch(pageName){
			case "home":
			ret = <PageHome
					todoList={this.props.todoList}
					doneList={this.props.doneList}
					featuresListener={this.props.featuresListener}
				/>;
			break;
			case "subject":
			ret = <PageSubject/>;
			break;
			case "free_breakfast":
			ret = <PageFree_breakfast/>;
			break;
			case "insert_chart":
			ret = <PageInsert_chart
					todoList={this.props.todoList}
					doneList={this.props.doneList}
					featuresListener={this.props.featuresListener}
					/>;
			break;
			case "settings":
			ret = <PageSettings/>;
			break;
		}
		return ret;
	}
	render(){
		const nowActiveFeature = this.getActivePage(this.state.nowActivePage);
		return (
			<div className="featuresArea">
				<div className="featureContent">
					{nowActiveFeature}
				</div>
				<MenuList
					nowActivePage = {this.state.nowActivePage}
					setPageChange = {this.setPageChange}
				/>
			</div>
			);
	}
}

//Home Page
class PageHome extends React.Component{
	constructor(props){
		super(props);
		this.getListItem =this.getListItem.bind(this);
		this.onAddTaskClick = this.onAddTaskClick.bind(this);
		this.onCancelWinClick = this.onCancelWinClick.bind(this);
		this.onContentChange = this.onContentChange.bind(this);
		this.onSendClick =this.onSendClick.bind(this);
		this.state = {
			addWinCls:"windAddNewTask hidden",
			txtValue:""
		};
	}
	onAddTaskClick(e){
		this.setState({
			addWinCls:"windAddNewTask"
		});
	}
	getListItem(list){
		if(list === null || list.length === 0)
			return "";
		let retList =[];
		list.map(function(item,i){
			 const tmp =<ListItem
							count={i+1}
							type={item.type}
							content={item.content}
						/>;
			retList =retList.concat(tmp);
		});
		return retList;
	}
	onCancelWinClick(){
		this.setState({
			addWinCls:"windAddNewTask hidden",
			txtValue:""
		});
	}
	onContentChange(e){
		const stateValue = this.state;
		const txtValue = e.target.value;
		stateValue.txtValue = txtValue;
		this.setState(stateValue);
	}
	onSendClick(){

		this.props.featuresListener(this.state.txtValue);
		this.setState({
			addWinCls:"windAddNewTask hidden",
			txtValue:""
		});
	}
	render(){
		const {todoList,doneList}=this.props;
		const todoListGroup = this.getListItem(todoList);
		const doneListGroup = this.getListItem(doneList);
		return (
			<div className="Page">
				<div className="btnAddTask" onClick={this.onAddTaskClick}>
					<div className="btnContent">
						<div className="btnIcon"></div>
						<div className="btnName">Add Task</div>
					</div>
					
				</div>
				<div className="pageContent">
					<AddTaskWindow 
						addWinCls={this.state.addWinCls}
						onCancelWinClick={this.onCancelWinClick}
						onContentChange={this.onContentChange}
						onSendClick = {this.onSendClick }
						txtValue = {this.state.txtValue}
					/>
					<div className="toDoList list">
						<div className="title">To do</div>
						<div className="content">
							<ul>
								{todoListGroup}
							</ul>
						</div>
						
					</div>
					<div className="doneList list">
						<div className="title">Done</div>
						<div className="content">
							<ul>
								{doneListGroup}
							</ul>
						</div>
						
					</div>
				</div>

			</div>
			);
	}
}
function AddTaskWindow(props){
	const winCls = props.addWinCls;
	return(
		<div className={props.addWinCls}>
			<div className="winTitle">Add new task</div>
			<div className="content">
				<div className="title">
					Title
				</div>
				<div>
					<input className="txtContent" value={props.txtValue} type="text" onChange={props.onContentChange}/>
				</div>
			</div>
			<div className="footer">
				<div className="btn btnSend" onClick={props.onSendClick}>Send</div>
				<div className="btn btnCancel" onClick={props.onCancelWinClick}>Cancel</div>
			</div>
		</div>
		);
}
function ListItem(props){
	const {count,type,content} = props;
	const icon = type === "todo"?"icon icon-playback-play":"donListIcon";
	return (
		<li>
			<div className="listContent">
				<div className="listIcon">
					<div className={icon}></div>
				</div>								
				<div className="listText">{count}.{content}</div>
			</div>								
		</li>
		);
}
class PageSubject extends React.Component{
	constructor(props){
		super(props);
	
	}
		
	render(){
		
		return (
			<div className="featureContent">
				
			</div>
			);
	}
}
class PageFree_breakfast extends React.Component{
	constructor(props){
		super(props);
	
	}

	render(){

		return (
			<div className="featureContent">
3
			</div>
			);
	}
}
class PageInsert_chart extends React.Component{
	constructor(props){
		super(props);
		const nowDate = new Date();
		const dayMs = 24 * 60 * 60 * 1000;
		const starDateMs = nowDate.getTime() - 6 * dayMs;
		const startDate = new Date(starDateMs);
		const weekEndDayString=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`;
		const weekStartDayString=  `${startDate.getFullYear()}/${startDate.getMonth()+1}/${startDate.getDate()}`;

		this.state ={
			chartWeek:{
				start:weekStartDayString,
				end:weekEndDayString
			}
		};
		this.getDateList = this.getDateList.bind(this);
		this.getWeekList = this.getWeekList.bind(this);
		this.setChartWeek = this.setChartWeek.bind(this);
	}
	getDateList(list , nowDate){
		return list.filter(function(item){
			const thisDate = new Date(item.date);
			return thisDate.getTime() === nowDate.getTime();
		});
	}
	getWeekList(list , nowDate, weekStartDate){
		return list.filter(function(item){
			const theDay = new Date(item.date);
			const isThisWeek = theDay >= weekStartDate  && theDay <=nowDate;
			return  isThisWeek;
		});
	}
	setChartWeek(e ,type){
		const {start,end} = this.state.chartWeek;
		const dayMs = 24 * 60 * 60 * 1000;
		const weekMs = 7 * dayMs;
		let newStartMs;		
		let newEndMs ;
		switch(type){
			case "pre":
				newStartMs = new Date(start).getTime() - weekMs ;
				newEndMs = new Date(end).getTime() - weekMs ;	
				break;
			case "next":
				newStartMs = new Date(start).getTime() + weekMs ;
				newEndMs = new Date(end).getTime() + weekMs;	
				break;

		}

		const newStartDate = new Date(newStartMs);
		const newEndDate = new Date(newEndMs);
		const nowDate = new Date();
		if(nowDate < newStartDate)
			return;

		const weekEndDayString=  `${newEndDate.getFullYear()}/${newEndDate.getMonth()+1}/${newEndDate.getDate()}`;
		const weekStartDayString=  `${newStartDate.getFullYear()}/${newStartDate.getMonth()+1}/${newStartDate.getDate()}`;
		const newChartWeek ={
			start:weekStartDayString,
			end:weekEndDayString
		}
		this.setState({
			chartWeek:newChartWeek
		});
	}
	createChartDate(doneList,date){
		const labels = [];
		const dataSetData = [];
		let maxlen= 0;
		const startDate = new Date(date);
		for(let i = 0 ; i < 7; i++){
			const dayMs = 24 * 60 * 60 * 1000;
			const startDateMs =  new Date(startDate).getTime() + (dayMs*i) ;
			const tmpStartDate = new Date(startDateMs);

			const startDateMonth = tmpStartDate.getMonth()+1;
			const month = startDateMonth <10?"0"+startDateMonth:startDateMonth;
			const startDateDay = tmpStartDate.getDate();
			const day = startDateDay <10 ? "0"+ startDateDay: startDateDay;
			const dayString=  `${startDateMonth}/${startDateDay}`;
			const tmpDate = new Date(tmpStartDate.getFullYear()+"/"+dayString);
			const tmplen = this.getDateList(doneList,tmpDate).length;
			labels.push(dayString);
			dataSetData.push(tmplen);
			if(maxlen < tmplen)
				maxlen = tmplen ;
		}
		const data ={
					labels:labels, // 標題
					datasets: [{
						data: dataSetData, 
						backgroundColor: "#F4D03F",
                      	hoverBackgroundColor:"#F4D03F",
                        borderSkipped:"bottom",
						borderWidth: 1 // 外框寬度
					}]
				};
		const option = {
				legend: {
				  	display:false
				},
				layout:{
					padding:{
						left:10,
						right:10,
						top:30,
						bottom:10
					}
				},
				scales: {
				    xAxes: [
					    {
							gridLines:{
								display:false
							},
					    	ticks: {
					          fontSize: 20,
					          fontColor:"#9F9F9F"
					      }
				  		}
				  	],
				  	yAxes:[
						{
							gridLines:{
								display:false
							},
							ticks:{
								min:0,
								max:maxlen+5,
				          		fontColor:"#9F9F9F",
				          		fontSize: 20,
							}	
						}
				  	]
				  }
				};
		const ret = {
			data:data,
			option:option
		}
		return ret;
	}
	render(){
		const nowDate = new Date();
		const weekEndDayString=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()}`;
		const weekStartDayString=  `${nowDate.getFullYear()}/${nowDate.getMonth()+1}/${nowDate.getDate()-7}`;

		const weekStartDate = new Date(weekStartDayString);
		const weekEndDate = new Date(weekEndDayString)
		const {todoList ,doneList} = this.props;
		const todayTodoList = this.getDateList(todoList,weekEndDate); 
		const todayDoneList = this.getDateList(doneList,weekEndDate); 
		const todayListLength =  todayTodoList.length + todayDoneList.length;

		const weekTodoList = this.getWeekList(todoList,weekEndDate,weekStartDate);
		const weekDoneList = this.getWeekList(doneList,weekEndDate,weekStartDate);
		const weekListLength =  weekTodoList.length + weekDoneList.length;

		const {start,end} = this.state.chartWeek;
		const chartData= this.createChartDate(doneList,start); 
		
		return (
			<div>
				<div className="numberStatistics">
					<NumberStatistics
						type="Toady"
						date={weekEndDayString}
						listCount={todayListLength}
						doneCount={todayDoneList.length}
					/>
					<NumberStatistics
						type="Week"
						date=""
						listCount={weekListLength}
						doneCount={weekDoneList.length}
					/>
				</div>
				<div className="chartStatistics">
					<div className="nav">
						<span className="title">
							Chart
						</span>
						<div className="weekControl">
							<div  className="btn btnPre" onClick={(e)=>{ this.setChartWeek(e,"pre");}}>
								<div className="arrow yellow "></div>
								<div className="arrow background "></div>
							</div>
							<div className="weekView">{start} ~ {end}</div>
							<div  className="btn btnNext" onClick={(e)=>{ this.setChartWeek(e,"next");}}>
								<div className="arrow yellow "></div>
								<div className="arrow background "></div>
							</div>
						</div>
					</div>
					<div className="content">
						<Bar
							data={chartData.data}
							options={chartData.option}
							/>
					</div>
				</div>
			</div>
			);
	}
}

function NumberStatistics(props){
	const {type,date,listCount,doneCount} = props;
	const listCountString = listCount <10? `0${listCount}`: listCount;
	const doneCountString = doneCount <10 ? `0${doneCount}`: doneCount;
	return (
		<div className="column">
			<div className="title">
				<span className="type">{type}</span>
				<span className="date">{date}</span>
			</div>
			<div className="content">
				<div className="data list">
					<div>{listCountString}</div>
					<div className="title">List</div>
				</div>
				<div className="separation"></div>
				<div className="data done">
					<div>{doneCountString}</div>
					<div className="title">Done</div>
				</div>
			</div>
		</div>
		);

}
class PageSettings extends React.Component{
	constructor(props){
		super(props);
	
	}

	render(){

		return (
			<div className="featureContent">
5
			</div>
			);
	}
}

class MenuList extends React.Component{
	constructor(props){
		super(props);
		this.getMenuItemIcon = this.getMenuItemIcon.bind(this);
		this.onMenuItemClick = this.onMenuItemClick.bind(this);
	}
	getMenuItemIcon(menu){
		const nowActivePage = this.props.nowActivePage;
		const isActive = nowActivePage === menu;
		const ret = isActive?"active":"";
		return ret;
	}
	onMenuItemClick(e){
		const target = e.target;
		const menuName = target.dataset.menuname;
		this.props.setPageChange(menuName);
	}
	render(){
		const homeIcon = `menuIcon ${this.getMenuItemIcon("home")} fa fa-home`;
		const subjectIcon = `menuIcon2 ${this.getMenuItemIcon("subject")} menu-subject`;
		const free_breakfastIcon = `menuIcon2 ${this.getMenuItemIcon("free_breakfast")} menu-free_breakfast`;
		const insert_chartIcon = `menuIcon2 ${this.getMenuItemIcon("insert_chart")} menu-insert_chart`;
		const settingsIcon = `menuIcon2 ${this.getMenuItemIcon("settings")} menu-settings`;
		return (
			<div className="menuList">
				<div className="menuItem">
					<div className={homeIcon} data-menuname="home" onClick={this.onMenuItemClick}></div>
				</div>
				<div className="menuItem">
					<div className={insert_chartIcon} data-menuname="insert_chart" onClick={this.onMenuItemClick}></div>
				</div>
				<div className="menuItem">
					<div className={settingsIcon} data-menuname="settings" onClick={this.onMenuItemClick}></div>
				</div>
			</div>
			);
	}
}