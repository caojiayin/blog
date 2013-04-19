var highlightDiv = null;
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*＄)/g, "");
}
String.prototype.htmlEncode = function(){
  return this.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
dp.sh.HighlightAll = function(name, showGutter, showControls, collapseAll, firstLine , showColumns)
{
	function FindValue()
	{
		var a = arguments;
		
		for(var i = 0; i < a.length; i++)
		{
			if(a[i] == null)
				continue;
				
			if(typeof(a[i]) == 'string' && a[i] != '')
				return a[i] + '';
		
			if(typeof(a[i]) == 'object' && a[i].value != '')
				return a[i].value + '';
		}
		
		return null;
	}
	
	function IsOptionSet(value, list)
	{
		for(var i = 0; i < list.length; i++)
			if(list[i] == value)
				return true;
		
		return false;
	}
	
	function GetOptionValue(name, list, defaultValue)
	{
		var regex = new RegExp('^' + name + '\\[(\\w+)\\]＄', 'gi');
		var matches = null;

		for(var i = 0; i < list.length; i++)
			if((matches = regex.exec(list[i])) != null)
				return matches[1];
		
		return defaultValue;
	}

	var elements = document.getElementsByName(name);
	var highlighter = null;
	var registered = new Object();
	var propertyName = 'value';
	
	// if no code blocks found, leave
	if(elements == null)
		return;

	// register all brushes
	for(var brush in dp.sh.Brushes)
	{
		var aliases = dp.sh.Brushes[brush].Aliases;

		if(aliases == null)
			continue;
		
		for(var i = 0; i < aliases.length; i++)
			registered[aliases[i]] = brush;
	}

	for(var i = 0; i < elements.length; i++)
	{
		var element = elements[i];
		var options = FindValue(
				element.attributes['class'], element.className, 
				element.attributes['language'], element.language
				);
		var language = '';
		
		if(options == null)
			continue;
		
		options = options.split(':');
		
		language = options[0].toLowerCase();

		if(registered[language] == null)
			continue;
		
		// instantiate a brush
		highlighter = new dp.sh.Brushes[registered[language]]();
		
		// hide the original element
		//element.style.display = 'none';

		highlighter.noGutter = (showGutter == null) ? IsOptionSet('nogutter', options) : !showGutter;
		highlighter.addControls = (showControls == null) ? !IsOptionSet('nocontrols', options) : showControls;
		highlighter.collapse = (collapseAll == null) ? IsOptionSet('collapse', options) : collapseAll;
		highlighter.showColumns = (showColumns == null) ? IsOptionSet('showcolumns', options) : showColumns;
		
		// first line idea comes from Andrew Collington, thanks!
		highlighter.firstLine = (firstLine == null) ? parseInt(GetOptionValue('firstline', options, 1)) : firstLine;
		highlightDiv = highlighter;
		highlighter.Highlight(element[propertyName]);
		//elements.innerHTML = highlighter.div.outerHTML.trim();
		var _code = highlighter.div.outerHTML.trim().htmlEncode();
		$(highlighter.div.outerHTML).insertBefore($(element));
		showControls ? $(element).hide() : $(element).remove();
	}	
}
dp.sh.Toolbar.Command = function(name, sender)
{
	var n = sender;
	
	//while(n != null && n.className.indexOf('dp-highlighter') == -1)
	//	n = n.parentNode;
	//if(n != null)
		dp.sh.Toolbar.Commands[name].func(sender, highlightDiv);
}

$(function(){
	var height = $(document).height();
	var diff = $("#warp_main").outerHeight(true) - $("#warp_main").height();
	$("#warp_main").css({
		"min-height" : height - $(".header").outerHeight(true) - $(".footer").outerHeight(true) - diff +'px'
	});
	$("textarea[stype=hhl]").each(function(){
		var name = $(this).attr("name");
		dp.SyntaxHighlighter.HighlightAll(name,1,0);
	})
})