"use strict";

function CodeEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Code", Editor.filePath + "icons/misc/code.png");

	//Codemirror editor
	this.code = new CodeMirror(this.element,
	{
		value: "",
		matchBrackets: true,
		hintOptions:
		{
			hint: CodeMirror.hint.anyword,
			completeSingle: false
		},
		gutters: ["CodeMirror-lint-markers"]
	});

	var self = this;

	//Context menu event
	this.element.oncontextmenu = function(event)
	{
		var context = new ContextMenu();
		context.size.set(130, 20);
		context.position.set(event.clientX, event.clientY);
		
		var refactor = context.addMenu("Refactor");
		refactor.addOption("Rename", function()
		{
			self.server.rename(self.code);
		});

		refactor.addOption("Select", function()
		{
			self.server.selectName(self.code);
		});

		context.addOption("Documentation", function()
		{
			self.server.jumpToDef(self.code);
		});

		context.addOption("Copy", function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
			}
		});
		context.addOption("Cut", function()
		{
			var text = self.code.getSelection();
			if(text !== "")
			{
				Editor.clipboard.set(text, "text");
				self.code.replaceSelection("");
			}
		});
		context.addOption("Paste", function()
		{
			self.code.replaceSelection(Editor.clipboard.get("text"));
		});
		context.addOption("Auto ident", function()
		{
			self.code.execCommand("indentAuto");
		});
		context.addOption("Select all", function()
		{
			self.code.execCommand("selectAll");
		});
		context.addOption("Undo", function()
		{
			self.code.execCommand("undo");
		});
		context.addOption("Redo", function()
		{
			self.code.execCommand("redo");
		});
		context.updateInterface();
	};
}

CodeEditor.prototype = Object.create(TabElement.prototype);

//Update script editor settings
CodeEditor.prototype.updateSettings = function()
{
	this.setFontSize(Settings.code.fontSize);

	this.code.setOption("lint", {options: Settings.jslint});
	this.code.setOption("theme", Settings.code.theme);
	this.code.setOption("lineNumbers", Settings.code.lineNumbers);
	this.code.setOption("lineWrapping", Settings.code.lineWrapping);
	this.code.setOption("keyMap", Settings.code.keymap);
	this.code.setOption("autoCloseBrackets", Settings.code.autoCloseBrackets);
	this.code.setOption("styleActiveLine", Settings.code.highlightActiveLine);
	this.code.setOption("showMatchesOnScrollbar", Settings.code.showMatchesOnScrollbar);
	this.code.setOption("dragDrop", Settings.code.dragFiles);
	this.code.setOption("indentWithTabs", Settings.code.indentWithTabs);
	this.code.setOption("tabSize", Settings.code.tabSize);
	this.code.setOption("indentUnit", Settings.code.indentUnit);
};

//Set code editor font size
CodeEditor.prototype.setFontSize = function(size)
{
	if(size < 5)
	{
		size = 5;
	}

	Settings.code.fontSize = size;
	this.code.display.wrapper.style.fontSize = size + "px";
};

//Activate code editor
CodeEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	this.updateSettings();
};

//Return editor text
CodeEditor.prototype.getText = function()
{
	return this.code.getValue();
};

//Set editor text
CodeEditor.prototype.setText = function(text)
{
	this.code.setValue(text);
};

//Set language mode (javascript, glsl, etc)
CodeEditor.prototype.setMode = function(mode)
{
	this.code.setOption("mode", mode);
};

//Set onchange callback
CodeEditor.prototype.setOnChange = function(callback)
{
	this.code.on("change", callback);
};

//Update loop
CodeEditor.prototype.update = function()
{
	if(Editor.keyboard.keyPressed(Keyboard.CTRL) && Editor.mouse.wheel !== 0)
	{
		this.setFontSize(Settings.code.fontSize - Editor.mouse.wheel/100);
	}
};

//Update division Size
CodeEditor.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.code.setSize(this.size.x, this.size.y);		
	}
	else
	{
		this.element.style.display = "none";
	}
};