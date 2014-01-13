KISSY.add(function (S, Node, Base, XTemplate, UA, IO, Storage) {
    
    var $ = Node.all,
        NodeList = S.NodeList,
    	isSupport = "placeholder" in document.createElement("input")
    
    function Publisher(){
        Publisher.superclass.constructor.apply(this,arguments);
        this._init();
    }

    Publisher.ATTRS = {
        node : {
            value : null
        },
        maxLen : {
            value : 1500
        },
        placeholderText : {
            value : '请输入你的分享，1500字以内'
        },
        charType : {
            value : 'cn'
        },
        timeInterval : {
            value : 30
        },
        url : {
            value: null
        },
        callback : {
            value : null
        }
    };

    S.extend(Publisher , S.Base , {
        _init : function (){
            var self = this;

            self.node = self.get('node');
            if (!(self.node instanceof NodeList)) {
                self.node = $(self.node);
            }

            self.onList = {};
            self.fireList = {};

            self.render();
            self.bindUI();
        },
        render : function(){
            var self = this;
            var tpl = '<div class="publisher-status">'+
                           '<dl class="publisher-tags">'+
                                '<dd class="publisher-tag">分享</dd>'+
                                '<dd class="publisher-tag">开会</dd>'+
                            '</dl>'+
                            '<div class="publisher-fontcount">'+
                                '<em class="font-count">0</em>/{{maxLen}}'+
                            '</div>'+
                        '</div>'+
                        '<div class="publisher-textarea">'+
                            '<div class="tag-arrow">'+
                                '<span class="arrow-line arrow">◆</span>'+
                                '<span class="arrow-bg arrow">◆</span>'+
                            '</div>'+
                            '<textarea class="publisher-content" placeholder="{{{placeholderText}}}" id="{{{textareaNode}}}"></textarea>'+
                        '</div>'+
                        '<div class="publisher-buttons">'+
                            '<button class="publisher-submit">发布</button>'+
                        '</div>';
            var data = {
                maxLen: self.get('maxLen'),
                placeholderText: self.get('placeholderText'),
                textareaNode: self.get('textareaNode')
            }
            var render = new XTemplate(tpl).render(data);
            $(render).appendTo(self.node);

            self.textareaNode = self.node.one('.publisher-content');
            self.textareaWrap = self.node.one('.publisher-textarea');
            self.submitButton = self.node.one('.publisher-submit');
            self.fontCountNode = self.node.one('.font-count');

            //hack IE11
            if(UA.ie == 11) self.textareaNode.css('margin-top','6px');
        },
        bindUI : function(){
            var self = this;

            //判断是否支持placeholder
            var isSupport = "placeholder" in document.createElement("input");
            if(!isSupport){
                var labelTpl = '<label class="placeholder-text" style="color:#9a9a9a;font-family: Microsoft YaHei;position:absolute;left:12px;top:20px;top:18px\\0;*top:16px;" for="{{{textareaNode}}}">{{placeholderText}}</label>',
                    data = {
                        textareaNode: self.get('textareaNode'),
                        placeholderText: self.get('placeholderText')
                    }
                var labelHtml = new XTemplate(labelTpl).render(data);
                $(labelHtml).appendTo(self.textareaWrap);
                self.textareaNode.on('valuechange',function(){
                    if($(this).val() === ''){
                        $('.placeholder-text').show();
                    }
                    else{
                        $('.placeholder-text').hide();
                    }
                })
            }

            var maxLen = self.get('maxLen');
            self.submitStatus = false;

            //考虑中英文字符
            self.textareaNode.on('valuechange',function(e){
                var length = 0,
                    prevVal = e.prevVal,
                    newVal = e.newVal;

                for (var i = 0, len = newVal.length; i < len; i++){
                    if (newVal.charCodeAt(i) > 255){
                        length += 2;
                    }
                    else{
                        length += 1;
                    }
                }

                if (0 < len && len <= maxLen) 
                    self.submitStatus = true;
                else
                    self.submitStatus = false;

                if (self.get('charType') === 'cn')
                    self.fontCountNode.html(parseInt(length/2));
                else if (self.get('charType') === 'en')
                    self.fontCountNode.html(parseInt(length));
            })

            //提交按钮
            self.submitButton.on('click',function(){
                var timeInterval = self.get('timeInterval');

                if (self.submitStatus === true){
                    if (typeof self.fireList['submit'] != 'undefined')
                        self.fire('submit');
                    else{

                        var newVal = self.textareaNode.val(),
                            newTime = new Date().getTime(),
                            lastVal = Storage.getItem(self.get('node')+'lastPubVal'),
                            lastTime = Storage.getItem(self.get('node')+'lastPubTime');

                        //使用本地存储判断是否重复提交
                        if( lastVal === '' || ( /\d/.test(lastTime) && (newTime - lastTime) > timeInterval*1000 ) || lastVal != newVal ){

                            var ajax = IO({
                                type: 'post',
                                url: self.get('url'),
                                dataType: 'json',
                                data: {
                                    value: newVal
                                }
                            })
                        
                            ajax.then(function(r){
                                Storage.setItem(self.get('node')+'lastPubTime', newTime);
                                Storage.setItem(self.get('node')+'lastPubVal', newVal);
                                return r
                            }).then(function(r){
                                self.get('callback')(r[0])
                            })
                        }
                        else{
                            self._error();
                        }
                    }                    
                }
                else{
                    self._error();
                }
            })
        },
        on : function(type, fn){
            if(this.onList[type]) fn();
            this.fireList[type] = fn;
        },
        fire : function(type){
            this.onList[type] = true;
            if(this.fireList[type]) this.fireList[type]();
        },
        reset : function(){
            this.textareaNode.val('');
        },
        val : function(){
            return this.textareaNode.val()
        },
        fontCount : function(){
            return this.fontCountNode.html()
        },
        _error : function(){
            var self = this;
            var arrayNode = self.node.one('.arrow-bg');
            if(UA.ie < 10){
                self.textareaNode.animate({background:'#F5A9A9'}, {duration: 0.4}).animate({background:'#FFF'}, {duration: 0.2}).animate({background:'#F5A9A9'}, {duration: 0.4}).animate({background:'#FFF'}, {duration: 0.2});

                arrayNode.animate({color:'#F5A9A9'}, {duration: 0.4}).animate({color:'#FFF'}, {duration: 0.2}).animate({color:'#F5A9A9'}, {duration: 0.4}).animate({color:'#FFF'}, {duration: 0.2});
            }
            else{
                self.textareaNode.addClass('content-error');
                arrayNode.addClass('tag-error');
                setTimeout(function(){
                    self.textareaNode.removeClass('content-error');
                    arrayNode.removeClass('tag-error');
                },1000)
            }            
        }
    });

    return Publisher;
}, {requires:['node','base','xtemplate','ua','io','publisher/storage','publisher/index.css']});