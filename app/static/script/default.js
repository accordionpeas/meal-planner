var app = {

	addMore: {

		init: function(){
			var self = this;

			$('div.addMoreSection').each(function(){
				var $el = $(this);

				$(this).on('click', 'a.addMore', function(e){
					e.preventDefault();
					self.addMore($el);
				});
			});
		},

		addMore: function($el){
			var lastIndex = parseInt($el.data('lastIndex'), 10),
				repeatable = $el.find('div.addMoreRepeat:last').html(),
				html = '';

			for(var i=0; i<5; i++){
				html += repeatable
					.replace(/\[\d+\]/g, '[' + (++lastIndex) + ']')
					.replace(/value=".*"/g, 'value=""')
					.replace(/<textarea(.*)>.*<\/textarea>/g, '<textarea$1></textarea>');
			}

			$el
				.append(html)
				.data('lastIndex', lastIndex)
				.append($el.find('a.addMore').parent());
		}
	}
};

$(function(){
	app.addMore.init();
});