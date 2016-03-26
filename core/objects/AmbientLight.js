function AmbientLight(hex)
{
	THREE.AmbientLight.call(this, hex);
	this.updateable = true;
	this.name = "directional_light";
}

AmbientLight.prototype = Object.create(THREE.AmbientLight.prototype);
AmbientLight.prototype.update = update;

function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].updateable)
		{
			this.children[i].update();
		}
	}
}
