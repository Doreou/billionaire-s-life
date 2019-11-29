var total = 0;
var totalMoney = 0;
var benifit = 0;
var clickedID = -1;
// 用来记录购买量点击前的数字
var countBefore = 0;
//用于存放点击前输入框中数字的数组
var countBeforeArray = [];

//更新下次点击某商品前已加入到购物车的商品的数量
function refreshCountBefore() {
	for (var i = 0; i < goodsData.data.length; i++) {
		if ($("#count" + i)[0].value == "")
			countBeforeArray.push(0);
		else
			countBeforeArray.push($("#count" + i)[0].value);
	}
}
//初始化输入框的默认值值为0 只需在网页首次打开时执行
function fillInCount() {
	for (var i = 0; i < goodsData.data.length; i++) {
		$("#count" + i)[0].value = countBeforeArray[i];
	}
}


function updateAll() {
	//更新当前资金与收益
	total = $('#total')[0].innerHTML;
	$('#TCOYM')[0].innerHTML = total;
	totalMoney = Number(total.substring(0, total.length - 1));
	benifit =totalMoney/ (10000 * 24 * 60 * 60);
}

//网页加载完成时:
$(document).ready(function() {
	updateAll();
	var getBenifit = null;
	layui.use(['form'], function() {
		var form = layui.form;
		form.on('switch', function(data) {
			if (data.elem.checked) {
				layer.msg("您已将钱放入余额宝，收益为每秒:" + parseInt(benifit) + "元");
				getBenifit = setInterval(function() {
					totalMoney += benifit;
					$('#total')[0].innerHTML = totalMoney + "元";
					//调用函数更新当前持有以及收益
					updateAll();
				}, 1000)
			}
			if (!data.elem.checked) {
				clearInterval(getBenifit);
				getBenifit = null;
			}
		})

	})
	$(document).on('click', '.getIt', function() {
		clickedID = this.id.replace(/[^0-9]/ig, "");
		countBefore = countBeforeArray[clickedID];
		$('#count' + clickedID)[0].value = Number($('#count' + clickedID)[0].value) + 1;
		//调用结账函数
		Pay(Number($('#count' + clickedID)[0].value), clickedID);
	})
	// 动态加载H5
	for (var i = 0; i < goodsData.data.length; i++) {
		$('#first').append(
			"<div class='col-md-3'><div class='row' style='overflow: hidden;'><div style='position: relative; left: 10%; top: 10px;height: 200px;width: 80%;'><img src='" +
			goodsData.data[i].img +
			"' class='goodsPic' /></div></div><div class='row' style='overflow: hidden;'><div style='position: relative; left: 10%; top: 10px;height: 65px;width: 80%;'><p class='goodsName'>" +
			goodsData.data[i].title +
			"</p><div style='margin-top: 10px;'><p style='color: orangered;'>￥</p><p id='price" + i + "' class='price'>" +
			goodsData
			.data[i]
			.price +
			"</p></div></div></div><div class='row'><div class='layui-inline' style='position: relative; left: 10%; top: 10px;height: 45px;width: 80%;'><label class='layui-form-label' style='padding: 9px 0px; margin-bottom: 0;width: auto;'>数量：</label><div class='layui-input-inline' style='width: 140px;'><input type='number' style='display:none' id='hiddenValue" +
			i + "'><input type='number' id='count" +
			i +
			"' autocomplete='off' min='0' class='layui-input count' style='background-color: bisque; border: #5A6268 1px solid;'></div><button type='button' class='layui-btn getIt' id='getIt" +
			i + "'>放到购物车</button></div></div>"
		);
	}
	// 网页内容全部加载完成  进行输入框预置内容填充
	refreshCountBefore();
	fillInCount();
})

function Pay(param, id) {
	countBefore = countBeforeArray[id];
	console.log(countBefore);
	var price = Number($('#price' + id)[0].innerHTML);
	//获取input输入的值
	var countAfter = param;
	var count = countAfter - countBefore;

	totalMoney -= count * price;
	if (totalMoney < 0) {
		layer.msg("我钱不够了？！");
		//如果金额不足  则用当前剩余金额买最多的当前物品  并计算余额
		// 直接重置此商品之前的点击次数 使用当前输入的购买量计算出不购买此商品的剩余的当前金额 countAfter 当前传入的购买量
		totalMoney += countAfter * price;
		//计算最大购买量
		count = parseInt(totalMoney / price);
		$("#count" + id)[0].value = count;
		// 用最大购买量填入 并以此作为商品点击前的数量
		countBeforeArray[id] = count;
		// 此句无必要  仅使没有进入此判断的数据能够正常执行  可以省略此句在下方用else包裹1
		countAfter = count;
		//重新计算剩余金额
		totalMoney -= count * price;
	}
	// 1
	countBeforeArray[id] = countAfter;
	
	$('#total')[0].innerHTML = totalMoney + "元";
	updateAll();
	refreshCountBefore();
}

$(document).on('input', ".count", function(e) {
	clickedID = this.id.replace(/[^0-9]/ig, "");
	Pay(e.currentTarget.value, clickedID);
})
