function xhrGet(reqUri, callback, type) {
    var req = new XMLHttpRequest();
    
    req.open("GET", reqUri, false);
    req.requestType = type;
    req.onload = function() { callback(req); }
//    req.onreadystatechange=function()
//    {
//      if (req.readyState==4 && req.status==200)
//        {
//          console.log(req.responseText);
//        }
//      else
//      {
//    	  console.log("state = " + req.readyState);
//    	  console.log("status = " + req.status)
//      }
//    }
    
    req.send();
}

listRepos = function (xhr) {
    parsedJSON = JSON.parse(xhr.responseText);

    var ul = document.createElement('ul');
    for(i=0; i < parsedJSON.length;i++)
    {
    	repo = parsedJSON[i];
    	var li = document.createElement('li');
    	li.textContent = repo['name'];
    	ul.appendChild(li);
    }
    var repos = document.getElementById('repos');
    repos.appendChild(ul);

    return true;
};

var projectElement = new Array();
var projectUrl = new Array();

listProjects = function (xhr) {
    parsedJSON = JSON.parse(xhr.responseText);

    var ul = document.createElement('ul');
    for(var i=0; i < parsedJSON.length;i++)
    {
//    	git_url: "https://api.github.com/repos/russellkeenan/bonmodels/git/trees/767543dfe6c0f5062f92de558a6e8be6e53edeae"
//    		html_url: "https://github.com/russellkeenan/bonmodels/tree/master/projects/Test Project"
//    		name: "Test Project"
//    		path: "projects/Test Project"
//    		sha: "767543dfe6c0f5062f92de558a6e8be6e53edeae"
//    		size: 0
//    		type: "dir"
//    		url: "https://api.github.com/repos/russellkeenan/bonmodels/contents/projects/Test Project"
    	var item = parsedJSON[i];
    	if(item['type'] == "dir")
    	{
	    	var li = document.createElement('li');
	    	var itemName = item['name'];
	    	li.setAttribute("id", itemName)
	    	li.textContent = itemName;
	    	ul.appendChild(li);
	    	
	    	projectElement[i] = li;
	    	projectUrl[i] = item['url'];

	        console.log("Added " + itemName);
    	}
    }
    
    for(var p = 0; p < projectUrl.length; p++)
	{
        xhrGet(projectUrl[p], listContent, null);  	
	}
    var projects = document.getElementById('projects');
    projects.appendChild(ul);

    return true;
};

listContent = function (xhr) {
    parsedJSON = JSON.parse(xhr.responseText);

    var ul = document.createElement('ul');
    var item = null;
    for(var i=0; i < parsedJSON.length;i++)
    {
    	item = parsedJSON[i];
    	var li = document.createElement('li');
    	var a = document.createElement('a');
    	a.setAttribute('href','editor' + '?url=' + item['url']);
    	a.textContent = item['name'];
    	li.appendChild(a);
    	ul.appendChild(li);
    }
    
    // now have all content in ul.  Need somewhere to put ul
    // item should be pointing to last one (any will do)
    if(item != null)
	{
	    for(var p = 0; p < projectUrl.length; p++)
	    {
	    	if(item['url'] == projectUrl[p] + "/" + item['name'])
	    	{
	    		projectElement[p].appendChild(ul);
	    		return true;
	    	}
	    }
	    
	    // get to here if parent not found
	    var div = document.getElementById('lost-content');
		if(div == null)
		{
			var parent = document.getElementById('projects');
			div = document.createElement('div');
			div.setAttribute('id', 'lost-content');
			parent.appendChild(div);
		}
		div.appendChild(ul);
	}

    return true;
};

var github = "https://api.github.com";
//var github = "http://slashdot.org";
//Test code for you to run
var test = function() {
    xhrGet(github + "/users/russellkeenan/repos", listRepos, null);
    xhrGet(github + "/repos/russellkeenan/bonmodels/contents/projects", listProjects, null);
    //xhrGet('/media/js/standalone/libs/gamedev_assets/bg_menu.ogg', playSound, 'arraybuffer');
};

test();
