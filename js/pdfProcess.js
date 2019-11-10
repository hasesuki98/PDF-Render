let totalPages,$currentPage,currentPageNumber
$.fn.isInViewport = function() {
	var elementTop = $(this).offset().top;
	var elementBottom = elementTop + $(this).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();

	return elementBottom > viewportTop && elementTop <= viewportBottom;

};



function showCurrent(currentPageNumber){
	$('#text-box').val(currentPageNumber)
	$('#page-num').html( currentPageNumber)

}

$("#text-box").keyup(function () {
	var value = $(this).val();
	var currentData=parseInt(value)-1
	if( totalPages>=value && value>0 && value!==null ){

		scrollPage( $('#holder').children('div').eq(currentData) )
		currentPageNumber=parseInt($currentPage.attr('class').replace( /^\D+/g, ''))+1
		showCurrent( currentPageNumber )
	}

})

function scrollPage($currentPageData){
	$currentPage=$currentPageData
	$('html, body').animate({
		scrollTop: $currentPage .offset().top
	}, 0);
}
$('#next-page').on('click',function(){
	if($currentPage.next().length>0) {
		currentPageNumber=parseInt($currentPage.next().attr('class').replace( /^\D+/g, ''))+1
		if(totalPages>= currentPageNumber ){

			showCurrent(currentPageNumber)
			$currentPage= $currentPage.next()
			scrollPage($currentPage)
		}
	}

})
$('#prev-page').on('click',function(){
	if($currentPage.prev().length>0){
		currentPageNumber=parseInt($currentPage.prev().attr('class').replace( /^\D+/g, ''))+1
		if(currentPageNumber  >0){

			showCurrent(currentPageNumber)
			$currentPage= $currentPage.prev()
			scrollPage($currentPage)
		}
	}
	
})
function percentageSeen (thisData) {
	var viewportHeight = $(window).height(),
	scrollTop = $(window).scrollTop(),
	elementOffsetTop = thisData.offset().top,
	elementHeight = thisData.height();

	if (elementOffsetTop > (scrollTop + viewportHeight)) {
		return 0;

	} else if ((elementOffsetTop + elementHeight) < scrollTop) {
		return 100;
	} else {
		var distance = (scrollTop + viewportHeight) - elementOffsetTop;
		var percentage = distance / ((viewportHeight + elementHeight) / 100);
		percentage = Math.round(percentage);
		return percentage;
	}
}
$(window).scroll(function(){
	$('.canvas-wrapper').map(function(index){
		if(percentageSeen($(this))>=25 && $(this).isInViewport()  ){
			$currentPage=$(this)
			currentPageNumber=parseInt($currentPage.attr('class').replace( /^\D+/g, ''))+1
			showCurrent(currentPageNumber)
		}


	})
})
function range(start, end, step = 1) {
	const len = Math.floor((end - start) / step) + 1
	return Array(len).fill().map((_, idx) => start + (idx * step))
}

function renderPDF(url, canvasContainer, options) {


	options = options || { scale: 1 };



	function renderPage(page) {

		var viewport = page.getViewport(options.scale);
		var wrapper = document.createElement("div");
		wrapper.className = "canvas-wrapper";
		wrapper.setAttribute("id", "canvas-data");
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var renderContext = {
			canvasContext: ctx,
			viewport: viewport
		};

		canvas.height = viewport.height;
		canvas.width = viewport.width;
		wrapper.appendChild(canvas)
		canvasContainer.appendChild(wrapper);

		
		scrollPage($( "#canvas-data" ).first())

		page.render(renderContext);
		$('.canvas-wrapper').each(function(index){
			$(this).addClass('index-'+index)
		})
		currentPageNumber=parseInt($currentPage.attr('class').replace( /^\D+/g, ''))+1
		showCurrent(currentPageNumber)
	}


	function renderPages(pdfDoc) {
		totalPages=pdfDoc.numPages
		$('#page-count').html(totalPages)
		
		$('#text-box').val(1)
		range(1, totalPages).map(function(i){
			pdfDoc.getPage(i).then(renderPage)
		})
	}

	pdfjsLib.disableWorker = true;
	pdfjsLib.getDocument(url).then(renderPages);



}   



renderPDF($('#pdf').val() , document.getElementById('holder'));