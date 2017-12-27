var errorPage=function(message){
	var messageHtml='<div id="page-error" style="z-index:200" class="page-error" >'+
						'<p><img src="'+jsimagesBasePath+'/page-error-gantan.png"  /><span class="white pt10 dil f16">'+message+'</span></p>'+
						'<img src="'+jsimagesBasePath+'/img_diabtn.png" class="error-know pt20" />'+
					'</div>';
	messageHtml+='<div id="error-shadow" style="z-index:100" class="mask-shadow dn"></div>';
	$("body").append(messageHtml);
	
	$("#error-shadow").show();
	$("#page-error").addClass("p-show").on("click",".error-know",function(){
		$("#page-error").remove();
		$("#error-shadow").remove();
	});
};
function bottomShowPage(title,html){
	var bottomShow='<div id="bottomPage" class="mask-pop" style="z-index:501">'+
						'<div class="attached-tit tc f18">'+title+'<em id="bottomPage_close"></em></div>'+
						'<div class="bg_w attached-form">'+html+'</div>'
				   '</div>';
	$("body").append(bottomShow);
	$("body").append('<div id="bottomPage-shadow" style="z-index:100" class="mask-shadow dn"></div>');
	
	$("#bottomPage-shadow").show();
	$("#bottomPage").addClass("p-show");
	
	$("#bottomPage_close").bind("click",function(){
		$("#bottomPage").removeClass("p-show");
		$("#bottomPage-shadow").hide();
		setTimeout(function() {
			$("#bottomPage").remove();
			$("#bottomPage-shadow").remove();
		}, 300);
	});
}
function showLoading() {
	if ($('#showLoading').length<=0) {
		$('body').append('<div id="showLoading" class="allcommomn_backdrop"><div class="loadingimg"><img src="'+jsimagesBasePath+'/loading.gif' + '"/></div></div>');
	}else{
		$('#showLoading').removeClass('hide').addClass('show');
	}	
}
function close_loading() {
	$('#showLoading').removeClass('show').addClass('hide');
}
//JS日期系列：根据出生日期 得到周岁年龄                 
//参数strBirthday已经是正确格式的2007.02.09这样的日期字符串  
//后续再增加相关的如日期判断等JS关于日期处理的相关方法  
function jsGetAge(strBirthday)  
{         
    var returnAge;  
    var strBirthdayArr=strBirthday.split("-");  
    var birthYear = strBirthdayArr[0];  
    var birthMonth = strBirthdayArr[1];  
    var birthDay = strBirthdayArr[2];  
      
    d = new Date();  
    var nowYear = d.getFullYear();  
    var nowMonth = d.getMonth() + 1;  
    var nowDay = d.getDate();  
      
    if(nowYear == birthYear)  
    {  
        returnAge = 0;//同年 则为0岁  
    }  
    else  
    {  
        var ageDiff = nowYear - birthYear ; //年之差  
        if(ageDiff > 0)  
        {  
            if(nowMonth == birthMonth)  
            {  
                var dayDiff = nowDay - birthDay;//日之差  
                if(dayDiff < 0)  
                {  
                    returnAge = ageDiff - 1;  
                }  
                else  
                {  
                    returnAge = ageDiff ;  
                }  
            }  
            else  
            {  
                var monthDiff = nowMonth - birthMonth;//月之差  
                if(monthDiff < 0)  
                {  
                    returnAge = ageDiff - 1;  
                }  
                else  
                {  
                    returnAge = ageDiff ;  
                }  
            }  
        }  
        else  
        {  
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
        }  
    }  
      
    return returnAge;//返回周岁年龄  
      
}
//compose插件
(function(window){
    'use strict'
    /**
     * 属性覆盖
     */
    function extend(orig, target, deep){
        var toStr = Object.prototype.toString,
            arrayFlag = "[object Array]";
        orig = orig || {};
        for (var i in target) {
            if(deep === true && target.hasOwnProperty(i)) {
                if (typeof target[i] === "object") {
                    if(!orig[i]){
                        orig[i] = toStr.call(target[i]) === arrayFlag ? [] : {};
                    }
                    extend(orig[i], target[i]);
                }
                else {
                    orig[i] = target[i];
                }
            }
            else orig[i] = target[i];
        }
        return orig;
    }
    /**
     * 添加script事件
     */
    function addOnloadEvent(dom, callback, fail){
        if(dom && typeof dom.onload !== 'undefined'){
            dom.onload = function(){
                this.onload = null;
                this.onerror = null;
                callback();
            };
            dom.onerror = function(){
                this.onload = null;
                this.onerror = null;
                fail();
            };
        }
        else if(dom){
            dom.onreadystatechange = function(event){
                if(this.readyState =='complete' || this.readyState =='loaded'){
                    this.onreadystatechange = null;
                    callback();
                }
            };
        }
    }
    function isArray(object){
        return object && typeof object==='object' &&
            Array == object.constructor;
    }
    function trimUrl(str){
        if(str){
            var ret = str.match(/^\s*(\S*)\s*$/), retS;
            if(ret){
                retS = ret[1].match(/(.*)\?+$/);
                if(retS){
                    return retS[1];
                }
                else return ret[1];
            }
        }
        return str;
    }
    var compose = {
            /**
             * 配置信息
             */
            _config: {
                basePath:jscontextPath,//基本路径
                contextPath: false,//上下文路径设置，字符串标示绝对路径，true标示从compose中获取
                paths:{},
                param:"",
                storage: false//缓存开关
            },
            /**
             * 需求列表状态相关信息
             */
            _process: [],
            /**
             * satisfyMap记录
             */
            _satisfies: [],
            /**
             * 完成的js文件路径集合
             */
            _completedPaths: {},
            /**
             * 发生onload后获取事件源
             */
            _onLoadEvents: [],
            /**
             * 缓存key值
             */
            _storageKey: 'storage-param-',
            isElement: function(obj) {
                return !!(obj && obj.nodeType === 1);
            },
            isArray: function(obj) {
                return toString.call(obj) === '[object Array]';
            },
            isObject: function(obj) {
                var type = typeof obj;
                return type === 'function' || type === 'object' && !!obj;
            },
            cacheStorage:{},
            /**
             * 延迟执行
             */
            _delayer: {
                time: 0,
                used: false,
                push: function(callback, time){
                    var self = this;
                    this.used = true;
                    this._callback = function(){
                        if(callback){
                            callback();
                        }
                        self._timer = null;
                        self._callback = null;
                    };
                    this.time = time || 0;
                    this._timer = setTimeout(this._callback, this.time);
                },
                delay: function(time){
                    if(this._timer){
                        clearTimeout(this._timer);
                    }
                    if(this._callback){
                        if(time !== undefined) this._timer = time;
                        this._timer = setTimeout(this._callback, this.time);
                    }
                }
            },
            /**
             * 初始化
             */
            init: function () {
                this.initConfig();
                this.initLoad();
                this.initAndClearStorage();
            },
            /**
             * 添加script属性配置
             */
            initConfig: function(){
                var _config = this._config,
                    scripts = document.getElementsByTagName('script'),
                    l = scripts.length, script, contextPath, basePath, param, main;
                for(var i=0; i<l; i++){
                    script = scripts[i];
                    contextPath = script.getAttribute('data-contextpath') || '';
                    basePath = script.getAttribute('data-basepath') || '';
                    param = script.getAttribute('data-param') || '';
                    main = script.getAttribute('data-main') || '';
                    if(contextPath || basePath || main){
                        _config.contextPath = contextPath?(contextPath+"/"):"";
                        _config.basePath = basePath;
                        _config.param = param;
                        _config.main = main;
                        break;
                    }
                }
            },
            /*
             *加载main入口文件
             * */
            initLoad: function(){
                var main = this._config.main;
                if(main){
                    this.require([main],function () {});
                }
            },
            /**
             * 添加javascript配置
             */
            config: function(opt){
                var _config = this._config;
                extend(_config, opt, true);
                _config.contextPath = _config.contextPath || "";
                _config.basePath = _config.basePath || "";
                _config.param = _config.param || "";
            },
            /**
             * 获取项目路径
             */
            getContext: function(opt){
                return this._config.contextPath;
            },
            /**
             * 需求

             * param depend 判断此模块是否有依赖并需要提前获取该资源
             */
            require: function(pathId, requires, success, fail, existObjectNames){
                this.req(pathId, requires, success, fail, existObjectNames);
            },
            /**
             * 异步请求资源
             */
            async: function(pathId, requires, success, fail, existObjectNames){
                this.req(pathId, requires, success, fail, existObjectNames, {method:'async'});
            },
            /**
             * 并发请求资源,建议加载css资源等
             */
            paral: function(pathId, requires, success, fail, existObjectNames){
                this.req(pathId, requires, success, fail, existObjectNames, {method:'paral'});
            },

            /**
             * 需求处理函数
             *
             */
            req: function(pathId, requires, callback, fail, existObjectNames, opts){
                this._delayer.delay();
                if(isArray(pathId) || typeof pathId  === 'function'){
                    existObjectNames = fail;
                    fail = callback;
                    callback = requires;
                    requires = pathId;
                    pathId = null;
                }
                if(typeof requires  === 'function'){
                    existObjectNames = fail;
                    fail = callback;
                    callback = requires;
                    requires = [];
                }
                if(!callback || typeof callback === 'string'){
                    callback = function(){}
                }
                if(typeof fail  !== 'function'){
                    existObjectNames = fail;
                    fail = function(){};
                }
                if(existObjectNames === true){
                    existObjectNames = null;
                }
                requires._opts = opts = opts || {};
                requires._existObjectNames = existObjectNames || [];
                if(pathId && !pathId.match(/\.css|\.js/)){
                    pathId += '.js';
                }
                requires.pathId = pathId;
                requires.callback = callback;
                requires.contextPath = this._config.contextPath;
                requires.param = this._config.param;
                requires.basePath = this._config.basePath;
                requires.fail = fail;
                requires.method = opts.method;
                var handlingRequire = this._handlingRequire;
                if(this._config.storage && pathId && !this.get(pathId)){
                    this.put(pathId, {
                        pathId: pathId,
                        requires: requires.toString(),
                        callback: callback.toString()
                    });
                }
                if(opts.method === 'paral'){
                    requires = this.preHandleRequires(requires);
                    return this.handleRequire(requires[0]);
                }
                else if(handlingRequire){
                    if(!handlingRequire.completed){
                        if(opts.method !== 'async' && handlingRequire.waiting){
                            requires.parent = handlingRequire;
                        }
                        else{
                            return this.preHandleRequires(requires);
                        }
                    }
                }
                requires = this.preHandleRequires(requires);

                var self = this;
                this._handlingRequire = requires[0];
                setTimeout(function () {
                    self.handleRequire(requires[0]);
                });

            },
            /**
             * 满足
             */
            satisfy: function(require){
                if(require){
                    if(require.method != 'paral'){
                        var loadRequire = this._onLoadEvents.shift(),
                            handlingRequire = this._handlingRequire;;
                        if(loadRequire !== handlingRequire && (loadRequire && loadRequire._process.length)){
                            return;
                        }
                    }
                    if(require.type == 'css'){
                        require.completed = true;
                    }
                    else{
                        if(!require.resourceObject){
                            this.checkAndSetObjectByName(require);
                        }
                    }
                    if(require.method == 'paral'){
                        this.checkComplete(require);
                    }
                    else{
                        this.excCompleteAndExcNext(require);
                    }
                }
            },
            /**
             * 满足
             */
            unsatisfy: function(require){
                if(require.method != 'paral') {
                    this._onLoadEvents.shift();
                }
                var requires = this.getRequires(require);
                if(requires.fail){
                    requires.fail();
                    requires.failed = true;
                    delete require.fail;
                }
                if(this._handlingRequire === require){
                    this._handlingRequire = null;
                }
                if(require.element){
                    require.element.remove();
                }
                this.deleteRequires(require);
            },
            /**
             * 预处理
             */
            preHandleRequires: function(requires){
                var l = requires.length,
                    callback = requires.callback,
                    pathId = requires.pathId,
                    existObjectNames = requires._existObjectNames,
                    _process = requires.parent? requires.parent._process: this._process,
                    _satisfies = requires.parent? requires.parent._satisfies: this._satisfies,
                    i = _process.length,
                    tailFileExp = /\.css|\.js/,
                    path,
                    _requires = [],
                    count = 0,
                    type,
                    _satisfy,
                    require,
                    resourceObject,
                    configPath;
                for(var i=0; i<_process.length; i++){
                    count += _process[i].length;
                }
                for(var j=0; j<=requires.length; j++){
                    path = requires[j] ;
                    configPath = this._config.paths[path];
                    type = (configPath||path)&&(configPath||path).match(/\.css$/)?'css':'js';
                    _satisfy = _satisfies[count+j];
                    resourceObject = _satisfy && _satisfy.value;
                    require = {
                        type: type,
                        completed: _satisfy?true:false,
                        j: j,
                        i: i,
                        parent: requires.parent,
                        resourceObject: resourceObject,
                        resourceObjectPath: existObjectNames[j],
                        _process:[],
                        _satisfies:[],
                        method: requires.method
                    };
                    if(path){
                        if(path && path.match(/^http[s]?:\/\//)){
                            if(type == 'js' && !path.match(tailFileExp)){
                                require.path = path+'.js';
                            }
                            else{
                                require.path = path;
                            }
                        }
                        else if(configPath){
                            require.path = configPath&&configPath.match(tailFileExp)?configPath : configPath+'.js';
                            if(!require.resourceObjectPath){
                                require.resourceObjectPath = path;
                            }
                        }
                        else{
                            this.handleRequirePath(require, path, requires);
                        }
                    }
                    if(j == requires.length){
                        require.callback = callback;
                        if(pathId){
                            this.handleRequirePath(require, pathId, requires);
                        }
                    }
                    if(_satisfy){
                        this._completedPaths[require.path] = require;
                    }
                    _requires.push(require);
                }
                if(pathId){
                    this.handleRequirePath(_requires, pathId, requires);
                }
                if(requires.fail){
                    _requires.fail = requires.fail;
                }
                _process.push(_requires);
                return _requires;
            },
            /**
             * 处理require path
             */
            handleRequirePath: function(require, pathId, requires){
                var basePath = requires.basePath,
                    contextPath = requires.contextPath,
                    param = requires.param;
                require.path = this.handlePath(pathId, contextPath, basePath, param);
            },
            /**
             * 处理普通的path
             */
            handlePath: function(pathId, contextPath, basePath, param){
                var path,
                    tailFileExp = /\.css|\.js/;
                pathId = trimUrl(pathId);
                if(pathId.match(/\.css$/)){
                    path = contextPath ? contextPath + '/' + pathId : pathId;
                }
                else{
                    var tpath = contextPath ? contextPath + '/' + basePath : basePath;
                    path = (tpath ? tpath + '/' : '') + (pathId.match(tailFileExp)?pathId : pathId+'.js');
                }
                if(param){
                    path += pathId.match(/\.js\?/) ? pathId.match(/\?$/) ? param : '&' + param : '?'+ param;
                }
                path = path.replace(/\/\/\/+/g, '/');
                return path;
            },
            /**
             * 处理单个require
             */
            handleRequire: function(require){
                //对处理过的需求直接返回
                if(!require || !require.parent && require.completed){
                    return;
                }
                var paral = require.method == 'paral';
                if(!paral){
                    this._handlingRequire = require;
                    this.checkAndSetObjectByName(require);
                }
                if(!require.completed && require.callback && !paral){
                    this.checkComplete(require);
                }
                else if( !paral && (!require.path || require.resourceObject || (require.completed == true && require.type === 'css'))){
                    this.excCompleteAndExcNext(require);
                }
                else{
                    if(paral){
                        var requires = this.getRequires(require);
                        for(var i=0; i<requires.length; i++){
                            require = requires[i];
                            this.checkAndSetObjectByName(require);
                            if(require.completed){
                                this.checkComplete(require)
                            }
                            else{
                                this.addEvent(require);
                            }
                        }
                    }
                    else{
                        require.waiting = false;
                        this.addEvent(require);
                    }
                }
            },
            /**
             * 注册回调事件
             */
            addEvent: function(require, elementLoad){
                var path = require.path;
                if(!elementLoad && this._config.storage && path && path.match(/\.css/)){
                    var self = this;
                    this.getRemote(path, function (data) {
                        require.waiting = false;
                        self.satisfy(require);
                    }, function () {
                        self.addEvent(require, true);
                    })
                    return;
                }
                else if(!elementLoad && this._config.storage && path){
                    var param;
                    var storageObj = this.get(path.replace(/\?.*/, function (value) {
                        param = value;
                        return '';
                    }), true);
                    if(storageObj){
                        if(require.method != 'paral') {
                            require.waiting = true;
                        }
                        var callback = storageObj.callback.replace(/^function\s*[\w\d_]*\(/, 'function anonymous(');
                        this.require(
                            storageObj.pathId,
                            storageObj.requires?storageObj.requires.split(','):[],
                            new Function(callback + ';return anonymous.apply(null, Array.prototype.slice.apply(arguments))')
                        );
                        return;
                    }
                }

                if(this._onLoadEvents.some(function (item) {
                    if(item.path == require.path){
                        return true;
                    }
                })){
                    return;
                }
                var element = this.createElement(require.type, path),
                    self = this;
                if(!element){
                    return;
                }

                addOnloadEvent(element, function(){
                    require.waiting = false;
                    self.satisfy(require);
                }, function(){
                    require.waiting = false;
                    self.unsatisfy(require);
                });
                require.element = element;

                var head = document.head || document.getElementsByTagName('head')[0];
                if(require.method != 'paral') {
                    this._onLoadEvents.push(require);
                    setTimeout(function(){
                        head.appendChild(element);
                        require.waiting = true;
                    }, 0);
                }
                else{
                    head.appendChild(element);
                }

            },
            /**
             * 完成当前complete并执行下一个需求
             */
            createElement: function(type, path){
                if(!path)return;
                var element, config = this._config;
                if(type === 'css'){
                    element = document.createElement("link");
                    element.setAttribute('type', 'text/css');
                    element.setAttribute('rel', 'stylesheet');
                    element.setAttribute('href', path);
                }
                else{
                    element = document.createElement("script");
                    element.setAttribute('type', 'text/javascript');
                    element.setAttribute('src', path);
                    element.setAttribute('data-basepath', config.basePath);
                }
                element.setAttribute('data-contextpath', config.contextPath);
                return element;
            },
            /**
             * 完成当前complete并执行下一个需求
             */
            excCompleteAndExcNext: function(require){
                require.completed = true;
                var nextRequire = this.excCompleteAnGetNext(require);
                this.handleRequire(nextRequire);
            },
            /**
             * 获取下一个需求并判断当前是否需要执行回调
             */
            excCompleteAnGetNext: function(require){
                this.checkComplete(require);
                return this.getNextRequire(require);
            },
            /**
             * 获取下一个需求
             */
            getNextRequire: function(require){
                if(!require)return;
                if(require._process && require._process.length){
                    var _process = require._process, l = _process.length;
                    for(var i=0; i<l; i++){
                        if(!_process[i]._called){
                            return _process[i][0];
                        }
                    }
                }
                var i = require.i,
                    j = require.j,
                    _process = require.parent && require.parent._process?require.parent._process:this._process,
                    requires = _process[require.i];
                if(!requires){
                    return require;
                }
                else if(j == requires.length - 1 || (j==0 && requires.length == 0)){
                    i += 1;
                    j = 0;
                    requires = _process[i];
                    if(!requires){
                        if(require.parent){
                            this.checkComplete(require.parent);
                            return this.getNextRequire(require.parent);
                        }
                    }
                }
                else{
                    j += 1;
                }
                var nextRequire = _process[i] && _process[i][j];
                return nextRequire;
            },
            /**
             * 是否需要执行回调
             */
            checkComplete: function(require){
                if(!require)return;
                this._handling = true;
                var j = require.j,
                    requires = this.getRequires(require),
                    resources = [];
                if(require.method == 'paral'){
                    var object;
                    for(var i=0; i<requires.length; i++){
                        require = requires[i];
                        if(!require || !require.completed){
                            break;
                        }
                        else{
                            object = require.resourceObject;
                            if(!object){
                                object = this.checkAndSetObjectByName(requires[i]);
                            }
                            resources.push(object);
                        }
                    }
                    if(i == requires.length -1){
                        require.completed = true;
                        require.callback.apply(window, resources);
                        this.handleRequire(this.getNextRequire(require));
                    }
                }
                else if(requires && (requires.length == 0 || j == requires.length - 1)){
                    if(require._process && require._process.length){
                        var _process = require._process, l = _process.length;
                        for(var i=0; i<l; i++){
                            if(!_process[i]._called){
                                return;
                            }
                        }
                    }
                    if(!requires._called){
                        //先把状态置为true，防止重复
                        var l = requires.length, object;
                        for(var i=0; i<l-1; i++){
                            object = requires[i].resourceObject;
                            if(!object){
                                object = this.checkAndSetObjectByName(requires[i]);
                            }
                            resources.push(object);
                        }
                        var ret = require.callback.apply(window, resources);
                        require.resourceObject = ret;
                        require.completed = true;
                        if(requires.path){
                            this._completedPaths[require.path] = require;
                        }
                        if(require.parent){
                            require.parent.resourceObject = ret;
                            require.parent.completed = true;

                            (requires || require.parent._process[0])._called = true;
                        }
                        else{
                            this._process[require.i]._called = true;
                        }
                        if(require !== this._handlingRequire){
                            return;
                        }
                        if(require.parent){
                            this.excCompleteAndExcNext(require.parent);
                        }
                        else{
                            this.handleRequire(this.getNextRequire(require));
                        }
                    }
                }
            },
            /**
             * 获取requires
             */
            getRequires: function (require) {
                var i = require.i,
                    j = require.j,
                    _process = require.parent && require.parent._process ? require.parent._process : this._process,
                    requires = _process[require.i];
                return requires;
            },
            /**
             * 删除requires
             */
            deleteRequires: function (require) {
                var i = require.i,
                    j = require.j,
                    parent = require.parent && require.parent._process ? require.parent : this,
                    _process = parent._process,
                    requires = _process[require.i];
                if(requires){
                    parent._process =  _process.slice(0, i).concat( _process.slice(i+1));
                }
            },
            /**
             * 判断当前对象是否存在，如存在，则不加载对应组的js文件
             */
            checkAndSetObjectByName: function(require){
                var origRequire = this._completedPaths[require.path],
                    resourceObjectPath = require.resourceObjectPath,
                    resourceObject = resourceObject;
                if(require.type == 'css'){
                    if(origRequire){
                        require.completed = true;
                        require.resourceObject = true;
                        return true;
                    }
                    else if(require.completed){
                        this._completedPaths[require.path] = true;
                        return require.resourceObject = true;
                    }
                    return;
                }
                if(require.resourceObject){return require.resourceObject}
                if(origRequire){
                    resourceObject = origRequire.resourceObject;
                    if(resourceObject){
                        require.resourceObject = resourceObject;
                        require.completed = true;
                        return resourceObject;
                    }
                }
                else if(!origRequire && require.path){
                    this._completedPaths[require.path] = require;
                }
                /*if(require && require.path && require.callback){
                 this.checkComplete(require);
                 return;
                 }*/
                if(!resourceObjectPath){
                    return;
                }
                if(require && require.callback){
                    return;
                }
                var names = resourceObjectPath.split('.'),
                    namesLength = names.length,
                    name,
                    obj = window;
                for(var j=0; j<namesLength; j++){
                    name = names[j];
                    if(!(j==0 && name == 'window')){
                        obj = obj && obj[name];
                    }
                }
                if(!obj){
                    return;
                }
                require.resourceObject = obj;
                require.completed = true;
                if(!this._completedPaths[require.path]){
                    this._completedPaths[require.path] = require;
                }
                return obj;
            },
            /*
             * 使用storage存数据
             * */
            put: function (key, value, noStorageKey){
                if(!this._config.storage){
                    return;
                }
                if(value && this.isObject(value) &&!(this.isFunction(value)
                    ||this.isArray(value)
                    ||this.isString(value)
                    ||this.isNumber(value))){
                    value = JSON.stringify(value);
                }
                var key = noStorageKey?key : (this._storageKey||'') + key,
                    localStorage = window.localStorage;
                try{
                    if(localStorage){
                        localStorage.setItem(key, value);
                    }
                }catch(e){
                }
            },
            /*
             * 使用storage取数据，如果失败从this.sessionStorage取
             * */
            get: function (key){
                var value = '', localStorage = window.localStorage;
                if(localStorage && !this._config.storage){
                    return value;
                }
                try{
                    var key = (this._storageKey||'') + key;
                    if(localStorage){
                        value = localStorage.getItem(key);
                    }
                }catch(e){
                }
                if(value && /^\{[\s\S]*\}$/.test(value)){
                    value = JSON.parse(value);
                }
                if(value === 'undefined' || value === 'null'){
                    value = '';
                }
                return value;
            },
            /*
             * 初始化storage版本设置和清空历史数据
             * */
            initAndClearStorage: function (){
                var localStorage = window.localStorage;
                if(localStorage && this._config.storage){
                    try{
                        var param = this._config.param,
                            _storageKey = this._storageKey,
                            lastParam = localStorage.getItem(_storageKey),
                            length = localStorage.length;
                        localStorage.setItem(_storageKey, param||'');
                        if(lastParam && lastParam != param){
                            var matchReg = new RegExp('^'+_storageKey+'.+'),
                                key;
                            while(length--){
                                key = localStorage.key(length);
                                if(key.match(matchReg)){
                                    localStorage.removeItem(key);
                                }
                            }
                        }
                    }catch(e){
                    }
                }
            },
            ajax: function(options){
                var xmlhttp = null;
                if (window.XMLHttpRequest){
                    xmlhttp=new XMLHttpRequest();
                }
                else if (window.ActiveXObject){
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                if (xmlhttp!=null){
                    xmlhttp.onreadystatechange = function ()
                    {
                        if (xmlhttp.readyState==4)
                        {
                            if (xmlhttp.status==200)
                            {
                                if(options.success){
                                    options.success(xmlhttp.responseText, xmlhttp);
                                }
                            }
                            else
                            {
                                if(options.failed){
                                    options.failed(xmlhttp);
                                }
                            }
                        }
                    };
                    xmlhttp.open("GET", options.url||'', true);
                    xmlhttp.send(null);
                }
            },
            handleCss: function (data, url){
                var path = '',
                    httpPreReg = /^https?:\/\//,
                    handledData;
                if(url.match(httpPreReg)){
                    path = '';
                    handledData = data;
                }
                else{
                    var tailReg = /[^\/]*$/,
                        filePathReg = /[\:]/;
                    path = (location.origin+location.pathname).replace(tailReg, '')
                        + url.replace(tailReg, '');
                    handledData = data.replace(/url\s*\(([^\s;\(\)]*)\)\s*/g, function (value, url){
                        if(url){
                            if(url.match(httpPreReg) || url.match(filePathReg)){
                                return value;
                            }
                            else{
                                var split = url.match(/^\s*(['"])?([^'"]*)/);
                                split[1] = split[1]||'';
                                return 'url('+split[1]+path+split[2]+split[1]+')';                            }
                        }
                        else{
                            return value;
                        }
                    });
                }
                return handledData;
            },
            getRemote: function (url, success, fail) {
                var self = this,
                    pathId = url.replace(/\?.*/,''),
                    storageData = self.get(pathId);
                if(storageData){
                    append(storageData);
                }
                else{
                    this.ajax({
                        url: url,
                        success: function (data, xmlhttp) {
                            if(pathId){
                                self.put(pathId, data);
                            }
                            append(data);
                        },
                        failed: function (xmlhttp) {
                            fail && fail.call(this, xmlhttp);
                        }
                    });
                }
                function append(data){
                    var el = document.createElement('style');
                    el.setAttribute('type', 'text/css');
                    el.innerHTML = self.handleCss(data, url);
                    document.head.appendChild(el);
                    success && success(data);
                }
            }
        };
	    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function(name) {
	        compose['is' + name] = function(obj) {
	            return toString.call(obj) === '[object ' + name + ']';
	        };
	    });
	    window.compose = compose;
	    compose.init();
})(window)










































//template插件
!function() {
	function a(a) {
		return a.replace(t, "").replace(u, ",").replace(v, "").replace(w, "").replace(x, "").split(y)
	}
	function b(a) {
		return "'" + a.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'"
	}
	function c(c, d) {
		function e(a) {
			return m += a.split(/\n/).length - 1,
			k && (a = a.replace(/\s+/g, " ").replace(/<!--[\w\W]*?-->/g, "")),
			a && (a = s[1] + b(a) + s[2] + "\n"),
			a
		}
		function f(b) {
			var c = m;
			if (j ? b = j(b, d) : g && (b = b.replace(/\n/g,
			function() {
				return m++,
				"$line=" + m + ";"
			})), 0 === b.indexOf("=")) {
				var e = l && !/^=[=#]/.test(b);
				if (b = b.replace(/^=[=#]?|[\s;]*$/g, ""), e) {
					var f = b.replace(/\s*\([^\)]+\)/, "");
					n[f] || /^(include|print)$/.test(f) || (b = "$escape(" + b + ")")
				} else b = "$string(" + b + ")";
				b = s[1] + b + s[2]
			}
			return g && (b = "$line=" + c + ";" + b),
			r(a(b),
			function(a) {
				if (a && !p[a]) {
					var b;
					b = "print" === a ? u: "include" === a ? v: n[a] ? "$utils." + a: o[a] ? "$helpers." + a: "$data." + a,
					w += a + "=" + b + ",",
					p[a] = !0
				}
			}),
			b + "\n"
		}
		var g = d.debug,
		h = d.openTag,
		i = d.closeTag,
		j = d.parser,
		k = d.compress,
		l = d.escape,
		m = 1,
		p = {
			$data: 1,
			$filename: 1,
			$utils: 1,
			$helpers: 1,
			$out: 1,
			$line: 1
		},
		q = "".trim,
		s = q ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"],
		t = q ? "$out+=text;return $out;": "$out.push(text);",
		u = "function(){var text=''.concat.apply('',arguments);" + t + "}",
		v = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + t + "}",
		w = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (g ? "$line=0,": ""),
		x = s[0],
		y = "return new String(" + s[3] + ");";
		r(c.split(h),
		function(a) {
			a = a.split(i);
			var b = a[0],
			c = a[1];
			1 === a.length ? x += e(b) : (x += f(b), c && (x += e(c)))
		});
		var z = w + x + y;
		g && (z = "try{" + z + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + b(c) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");
		try {
			var A = new Function("$data", "$filename", z);
			return A.prototype = n,
			A
		} catch(B) {
			throw B.temp = "function anonymous($data,$filename) {" + z + "}",
			B
		}
	}
	var d = function(a, b) {
		return "string" == typeof b ? q(b, {
			filename: a
		}) : g(a, b)
	};
	d.version = "3.0.0",
	d.config = function(a, b) {
		e[a] = b
	};
	var e = d.defaults = {
		openTag: "<%",
		closeTag: "%>",
		escape: !0,
		cache: !0,
		compress: !1,
		parser: null
	},
	f = d.cache = {};
	d.render = function(a, b) {
		return q(a, b)
	};
	var g = d.renderFile = function(a, b) {
		var c = d.get(a) || p({
			filename: a,
			name: "Render Error",
			message: "Template not found"
		});
		return b ? c(b) : c
	};
	d.get = function(a) {
		var b;
		if (f[a]) b = f[a];
		else if ("object" == typeof document) {
			var c = document.getElementById(a);
			if (c) {
				var d = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
				b = q(d, {
					filename: a
				})
			}
		}
		return b
	};
	var h = function(a, b) {
		return "string" != typeof a && (b = typeof a, "number" === b ? a += "": a = "function" === b ? h(a.call(a)) : ""),
		a
	},
	i = {
		"<": "&#60;",
		">": "&#62;",
		'"': "&#34;",
		"'": "&#39;",
		"&": "&#38;"
	},
	j = function(a) {
		return i[a]
	},
	k = function(a) {
		return h(a).replace(/&(?![\w#]+;)|[<>"']/g, j)
	},
	l = Array.isArray ||
	function(a) {
		return "[object Array]" === {}.toString.call(a)
	},
	m = function(a, b) {
		var c, d;
		if (l(a)) for (c = 0, d = a.length; d > c; c++) b.call(a, a[c], c, a);
		else for (c in a) b.call(a, a[c], c)
	},
	n = d.utils = {
		$helpers: {},
		$include: g,
		$string: h,
		$escape: k,
		$each: m
	};
	d.helper = function(a, b) {
		o[a] = b
	};
	var o = d.helpers = n.$helpers;
	d.onerror = function(a) {
		var b = "Template Error\n\n";
		for (var c in a) b += "<" + c + ">\n" + a[c] + "\n\n";
		"object" == typeof console && console.error(b)
	};
	var p = function(a) {
		return d.onerror(a),
		function() {
			return "{Template Error}"
		}
	},
	q = d.compile = function(a, b) {
		function d(c) {
			try {
				return new i(c, h) + ""
			} catch(d) {
				return b.debug ? p(d)() : (b.debug = !0, q(a, b)(c))
			}
		}
		b = b || {};
		for (var g in e) void 0 === b[g] && (b[g] = e[g]);
		var h = b.filename;
		try {
			var i = c(a, b)
		} catch(j) {
			return j.filename = h || "anonymous",
			j.name = "Syntax Error",
			p(j)
		}
		return d.prototype = i.prototype,
		d.toString = function() {
			return i.toString()
		},
		h && b.cache && (f[h] = d),
		d
	},
	r = n.$each,
	s = "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",
	t = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,
	u = /[^\w$]+/g,
	v = new RegExp(["\\b" + s.replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"),
	w = /^\d[^,]*|,\d[^,]*/g,
	x = /^,+|,+$/g,
	y = /^$|,+/;
	e.openTag = "{{",
	e.closeTag = "}}";
	var z = function(a, b) {
		var c = b.split(":"),
		d = c.shift(),
		e = c.join(":") || "";
		return e && (e = ", " + e),
		"$helpers." + d + "(" + a + e + ")"
	};
	e.parser = function(a) {
		a = a.replace(/^\s/, "");
		var b = a.split(" "),
		c = b.shift(),
		e = b.join(" ");
		switch (c) {
		case "if":
			a = "if(" + e + "){";
			break;
		case "else":
			b = "if" === b.shift() ? " if(" + b.join(" ") + ")": "",
			a = "}else" + b + "{";
			break;
		case "/if":
			a = "}";
			break;
		case "each":
			var f = b[0] || "$data",
			g = b[1] || "as",
			h = b[2] || "$value",
			i = b[3] || "$index",
			j = h + "," + i;
			"as" !== g && (f = "[]"),
			a = "$each(" + f + ",function(" + j + "){";
			break;
		case "/each":
			a = "});";
			break;
		case "echo":
			a = "print(" + e + ");";
			break;
		case "print":
		case "include":
			a = c + "(" + b.join(",") + ");";
			break;
		default:
			if (/^\s*\|\s*[\w\$]/.test(e)) {
				var k = !0;
				0 === a.indexOf("#") && (a = a.substr(1), k = !1);
				for (var l = 0,
				m = a.split("|"), n = m.length, o = m[l++]; n > l; l++) o = z(o, m[l]);
				a = (k ? "=": "=#") + o
			} else a = d.helpers[c] ? "=#" + c + "(" + b.join(",") + ");": "=" + a
		}
		return a
	},
	"function" == typeof define ? define(function() {
		return d
	}) : "undefined" != typeof exports ? module.exports = d: this.template = d
} ();

var ProductCal=function(compId,param,backFun){
	compose.require(["scripts/jssdk/base_cal.js"],function(baseCal){
		//试算页面
		baseCal.calInit($(compId),param,function(resData){
			backFun(resData)
		});
	});
}
window.ProductCal=ProductCal;
