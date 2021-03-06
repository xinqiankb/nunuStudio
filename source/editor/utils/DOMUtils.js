"use strict";

function DOMUtils(){}

//Check if a DOM element in completely visible in the viewport
DOMUtils.isVisible = function(element)
{
	var top = element.offsetTop;
	var left = element.offsetLeft;
	var width = element.offsetWidth;
	var height = element.offsetHeight;

	while(element.offsetParent)
	{
		element = element.offsetParent;
		top += element.offsetTop;
		left += element.offsetLeft;
	}

	return top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth);
};

//Check if a DOM element is out of the window and how far it is, returns object with x and y values, if the value is 0 the element is inside the window on that axis.
DOMUtils.checkBorder = function(element)
{
	var top = element.offsetTop;
	var left = element.offsetLeft;
	var width = element.offsetWidth;
	var height = element.offsetHeight;

	while(element.offsetParent)
	{
		element = element.offsetParent;
		top += element.offsetTop;
		left += element.offsetLeft;
	}

	var result = {x: 0, y: 0};

	//Over the top of the window
	if(top < window.pageYOffset)
	{
		result.y = top - window.pageYOffset;
	}
	//Bellow the window
	else if((top + height) > (window.pageYOffset + window.innerHeight))
	{
		result.y = (top + height) - (window.pageYOffset + window.innerHeight);
	}

	//Left to the window
	if(left < window.pageXOffset)
	{
		result.x = left - window.pageXOffset;
	}
	//Right to the window
	else if((left + width) > (window.pageXOffset + window.innerWidth))
	{
		result.x = (left + width) - (window.pageXOffset + window.innerWidth);
	}

	return result;
};
