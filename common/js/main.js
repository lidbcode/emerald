mui.init()

mui.plusReady(function() {
	var parentWv = plus.webview.currentWebview();
	var pageList = [{
			url: './index.html',
			id: 'index'
		},
		{
			url: './category.html',
			id: 'category'
		},
		{
			url: './packet.html',
			id: 'packet'
		},
		{
			url: 'https://m.chuchutong.com/js/order/vueorder/html/orderindex.html',
			id: 'personal'
		}
	];
	var pageSize = pageList.length
	for(var i = 0; i < pageSize; i++) {
		var url = pageList[i].url
		var id = pageList[i].id
		if(plus.webview.getWebviewById(id)) return;
		else {
			var newWv = plus.webview.create(url, id, {
				bottom: '50px',
				top: '0px'
			})
			i == 0 ? newWv.show() : newWv.hide();
			parentWv.append(newWv);
		}
	}

	var showWv = "index"
	mui('.mui-bar').on('tap', '.mui-tab-item', function(e) {
		var willShowWv = this.dataset.id;
		if(showWv == willShowWv) return;
		else {
			plus.webview.getWebviewById(showWv).hide();
			plus.webview.getWebviewById(willShowWv).show();
			showWv = willShowWv;
		}
	})
})