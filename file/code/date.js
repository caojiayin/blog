/*
					<select name="birthday[year]" id="isYear" style="width:100px;" >
								</select><em>年</em>
								<select name="birthday[month]" id="isMonth" style="width:60px;" ></select>
								<em>月</em>
								<select name="birthday[day]" id="isDay" style="width:60px;" ></select><em>日</em>
	                            <script>new CDate().init(0,[{$member['birthlist'][0]},{$member['birthlist'][1]},{$member['birthlist'][2]}]);</script>
*/

/*日期联动选择 begin*/
function CDate(){
	this.seItem = ['isYear','isMonth','isDay'];
    this.beginYear = 0; //开始日期 
    this.defaultval = [0,0,0];
}
CDate.prototype.init = function(beginYear,defaultval){
	this.beginYear = beginYear != undefined && Utils.isInt(beginYear) ? beginYear : 1970;
	this.defaultval = defaultval != undefined ? defaultval : [0,0,0];
    for(var i = 0; i < this.seItem.length; i++){
        document.getElementById(this.seItem[i]).options.add(new Option('', ''));
    }
    this.setYear();
    this.selected();
}
CDate.prototype.selected = function(){
	if(this.defaultval[0] == 0){return false;}
	for(var i = 0; i < this.seItem.length; i++){
		if(this.defaultval[i] != 0){
			this.ExitItem(document.getElementById(this.seItem[i]),this.defaultval[i]);
		}
	}
}
CDate.prototype.ExitItem = function(objSelect, objItemValue){
    for (var i = 0; i < objSelect.options.length; i++) { 
        if (objSelect.options[i].value == objItemValue) {
            objSelect.options[i].selected = true; 
            try{objSelect.onchange();}catch(e){}
            break;
        }
    }
    return false;
}
CDate.prototype.setYear = function(){
    var cYear = new Date().getFullYear();
    var obj = document.getElementById(this.seItem[0]);
    for(var i = this.beginYear; i <= cYear; i++){
       obj.options.add(new Option(i, i));     
    }
    obj.onchange = function(){new CDate().setMonth();new CDate().setDay();};
    
}
CDate.prototype.setMonth = function(){
    var MonthLength = 12;
    var cYear = new Date().getFullYear();
    var year = document.getElementById(this.seItem[0]).value;
    var obj = document.getElementById(this.seItem[1]);
    var selectIndex = obj.selectedIndex;
    for(var i = 1; i <= MonthLength; i++){
        if(!obj.options[i]){
            obj.options.add(new Option(i, i)); 
        }            
    }
    var cMonth = new Date().getMonth()+1;
    if(cYear == year && MonthLength != cMonth){   
        for(var j = obj.options.length; j > cMonth; j--){
            obj.options[j] = null;
        }
    }
    if(selectIndex > obj.options.length){
        obj.options[obj.options.length - 1].selected = true;
    }
    obj.onchange = new Function("new CDate().setDay();");
}
CDate.prototype.setDay = function(){
    var DayLength = 31;
    var cMonth = document.getElementById(this.seItem[1]).value;
    var Month = new Date().getMonth()+1;
    var cDay = this.checkDay(cMonth);
    var obj = document.getElementById(this.seItem[2]);
    var selectIndex = obj.selectedIndex;
    for(var i = 1; i<= cDay;i++){
        if(!obj.options[i]){
            obj.options.add(new Option(i, i));
        }       

    }
    if(cDay != DayLength){
        for(var j = obj.options.length; j > cDay; j--){
            obj.options[j] = null;
        }        
    }
    if(selectIndex > obj.options.length){
        obj.options[obj.options.length - 1].selected = true;
    }       
}
CDate.prototype.checkDay = function(month){
    if (month.replace(/(1|3|5|7|8|10|12)/ig,'')==''){
        return 31;
    }else if(month.replace(/(4|6|9|11)/ig,'')=='') {
        return 30;
    }else{
        return (new Date(document.getElementById(this.seItem[0]).value , 2 , 0).getDate());
    }
}
/*日期联动选择 end*/